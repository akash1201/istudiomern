import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import Orders from '../models/orderModel.js'

import Shippo from 'shippo'
import Stripe from 'stripe'
import dotenv from 'dotenv'
import Product from '../models/productModel.js'
import Payment from '../models/paymentModel.js'
import PlatformFees from '../models/platformFees.js'
import Order from '../models/orderModel.js'

// var shippo = require('shippo')(process.env.SHIPPO_SK);

dotenv.config()
let shippo = new Shippo(process.env.SHIPPO_SK)
const stripe = new Stripe(process.env.STRIPE_SK)

const getRates = asyncHandler(async (req, res)=>{

          let id = req.params.id
          let vendor = await User.findById(id)
          let product = await Product.findById(req.params.productId)
          let qty = parseInt(req.params.qty)

          let companyAddress = vendor.companyAddress
          companyAddress['name'] = vendor.name+' '+vendor.lastName
          companyAddress['company'] = vendor.companyName
          companyAddress['email'] = vendor.companyEmail

          let destination = req.body.destination
          let dimension = product.dimensions

        
              
          dimension["distance_unit"] = "in"
          dimension["mass_unit"] = "lb"

          let items = []
          for(let i=0; i<qty; ++i){
              items = [...items, dimension]
          }

          console.log(items)
          //Custom declaration for international shipping

          if(destination.country !== 'US'){
            let variant = await Product.findById(req.body.variant)
            let customsItem = {
                "description":variant.name,
                "quantity": qty,
                "net_weight":dimension.weight,
                "mass_unit":"lb",
                "value_amount": variant.offerPrice?variant.offerPrice:variant.price,
                "value_currency":"USD",
                "origin_country":"US",
            }
          let customDeclaration = await  shippo.customsdeclaration.create({
                "contents_type": "MERCHANDISE",
                "contents_explanation": `${variant.name} PURCHASE`,
                "non_delivery_option": "RETURN",
                "certify": true,
                "certify_signer": destination.name,
                "items": [customsItem],
            });

            var shipment = await shippo.shipment.create({
                "address_from": companyAddress,
                "address_to": destination,
                "parcels": items,
                "async": true,
                "customs_declaration": customDeclaration,
            })
    
       res.json(shipment)

          }else{
            var shipment = await shippo.shipment.create({
                "address_from": companyAddress,
                "address_to": destination,
                "parcels": items,
                "async": true
            })
       res.json(shipment)
          }
})

const getReturnRates = asyncHandler(async(req, res)=> {

    let orderId = req.params.orderId
    const order = await Orders.findById(orderId)
    const product = await Product.findById(order.productId)
    console.log(product)

    const vendor = await User.findById(order.vendorId)
    
    let to = {
        name: order.shippingAddress.name,
        street1: order.shippingAddress.address,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        country: order.shippingAddress.country,
        zip: order.shippingAddress.postalCode,
        phone: order.shippingAddress.phone,
        email: order.shippingAddress.email
    }
    let from = {
        street1: vendor.companyAddress.street1,
        city: vendor.companyAddress.city,
        state: vendor.companyAddress.state,
        country: vendor.companyAddress.country,
        zip: vendor.companyAddress.zip,
        name: vendor.name,
        company: vendor.companyName,
        email: vendor.companyEmail
    }
    let dimension = product.dimensions       
    dimension["distance_unit"] = "in"
    dimension["mass_unit"] = "lb"
    let items = []

    for(let i=0; i<order.qty; ++i){
        items = [...items, dimension]
    }

    var shipment = await shippo.shipment.create({
        "address_from": from,
        "address_to": to,
        "parcels": items,
        "extra": {"is_return": true},
        "async": true,
    })
   let providers = [];
   for(let i=0; i<shipment.rates.length; ++i){
       if(!providers.includes(shipment.rates[i].provider)){
           providers = [...providers, shipment.rates[i].provider]
       }
   }

   console.log(shipment.rates)
  let rates = []
   for(let i=0; i<providers.length; ++i){
       let img, pRates = []
       for(let j=0; j<shipment.rates.length; ++j){
               if(shipment.rates[j].provider == providers[i]){
                   pRates = [...pRates, shipment.rates[j]]
                   img = shipment.rates[j].provider_image_200
               }
       }
       rates = [...rates, {provider: providers[i], image: img, rates: pRates}]
   }
   console.log(rates)
   res.json(rates)
    
})

const shippoWebhook = asyncHandler(async(req, res)=>{
   
    const order = await Orders.findOne({shipping_id: req.body.data.tracking_status.object_id})

    if(order){
        switch(req.body.data.tracking_status.status){
     
            case 'DELIVERED':
                await Order.updateOne({shipping_id: req.body.data.tracking_status.object_id}, {$set: {shipping_status: 'Package Delivered'}})
                // order.shipping_status = 'Package Delivered'
                initiatePayout(order._id, order.vendorId, order.productId)
    
                break;
            case 'RETURNED': 
            await Order.updateOne({shipping_id: req.body.data.tracking_status.object_id}, {$set: {shipping_status: 'Package Returned', isCancel: true}})
                // order.isCancel = true
                // order.shipping_status = 'Package Returned'
                break;
            case 'FAILURE' :
                await Order.updateOne({shipping_id: req.body.data.tracking_status.object_id}, {$set: {shipping_status: 'Order Failed', isCancel: true}})
                // order.isCancel = true
                // order.shipping_status = 'Order Failed'
                break;
            case 'TRANSIT' :
                await Order.updateOne({shipping_id: req.body.data.tracking_status.object_id}, {$set: {shipping_status: 'Order Dispatched'}})
                // order.shipping_status = 'Order Dispatched'
                break;
                default:
                    console.log("Default")
    
        }
        // let newOrder = await order.save()
    }
    res.json(req.body)
})

const initiatePayout = async (orderId, vendorId, productId) => {
let payment = await Payment.findOne({orderId: orderId})

if(payment.status == 'unpaid'){
    let vendor = await User.findById(vendorId)
let product = await Product.findById(productId)
const fees = await PlatformFees.find({})


let amount = parseFloat(payment.amount) - parseFloat(payment.discount)
let cut = parseFloat((parseFloat(fees[0].amount) * amount)/100)
let payable = parseInt((amount-cut)*100)

try{
    const transfer = await stripe.transfers.create({
        amount: payable,
        currency: 'usd',
        destination: vendor.stripeCompanyAccountId
      });
      await Payment.updateOne({orderId: orderId}, {$set : {status: 'paid', payout_id: transfer.id, amount_paid: parseFloat(payable/100).toFixed(2)}})
    console.log(transfer)
}catch(err){
    console.log(err)
}
}
}

export {
          getRates,
          shippoWebhook,
          getReturnRates

}
