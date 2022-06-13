import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import User from '../models/userModel.js'
import Stripe from 'stripe'
import Shippo from 'shippo'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import {
  placeOrder
} from '../controllers/printfulController.js'
import fetch from 'node-fetch'
import { createJournalEntry } from './quickBooksController.js'
import  ContactInfo from '../models/contactInfoModel.js' 
import encode from 'base-64'
import PlatformFees from '../models/platformFees.js'
import Payment from '../models/paymentModel.js'
import Notifications from '../models/Notifications.js'
import Product from '../models/productModel.js'



dotenv.config()


const stripe = new Stripe(process.env.STRIPE_SK)
let shippo = new Shippo(process.env.SHIPPO_SK)
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  
   let data = req.body.orders

   let orderId = []
   let orders = []

   let price = 0;
   let shippingCharge = 0;

   for(let i = 0; i<data.length; ++i){
    let obj = {}
    let obj1 = {}
    if(!data[i].fromPrintful){
      obj = await shippo.transaction.create({
        "rate": data[i].shipping_id,
        "label_file_type": "PDF",
        "async": false
    })

    data[i].shipping_transaction_id = obj.object_id     

    obj1 = await shippo.transaction.retrieve(obj.object_id )

    }
    const order = await Order.create(data[i])

    orderId = [...orderId, order._id]
    orders = [...orders, { ...order._doc,
                              tracking_number:data[i].fromPrintful? "Printful Standard Shipment":obj1.tracking_number,
                              tracking_url_provider:data[i].fromPrintful? "Printful Standard Shipment" : obj1.tracking_url_provider}
              ]

    price += parseFloat(data[i].price)*parseInt(data[i].qty)
    shippingCharge += parseFloat(data[i].shippingCharge)*parseInt(data[i].qty)
   }
   if(data[0].paymentMethod == 'card'){

    let userId = data[0].user
    let user = await User.findById(userId)

    const stripeAddress=data[0].BillingAddress.address+", "+data[0].BillingAddress.city+", "+data[0].BillingAddress.country+", Zip:"+data[0].BillingAddress.postalCode

    try{
      const customer = await stripe.customers.update(user.stripeId, {
        default_source: data[0].card
      });
    }catch(err){
    console.log(err)
    }

    let param = {
      amount: parseInt((price+shippingCharge-parseFloat(req.body.promoDiscount))*100),
      currency: 'USD',
      description: 'Order Payment',
      customer: user.stripeId,
      metadata:{
        name: user.name,
        address: stripeAddress
      }
    }

    try{

      //Charge a customer

      let customerCharge = await stripe.charges.create(param)
      
      let data = []

      for(let i=0; i<orders.length; ++i){
        if(!orders[i].fromPrintful){
          data = [...data, {
            vendor: orders[i].vendorId,
            amount: parseFloat(parseFloat(orders[i].price)*parseInt(orders[i].qty)).toFixed(2),
            orderId: orders[i]._id,
            discount: 0,
            status: 'unpaid',
            stripeChargeId: customerCharge.id,
            promocode: '',
            shipping: orders[i].shippingCharge
          }]
        }
      }


      for(let i=0; i<data.length; ++i){
        for(let j=0; j<req.body.promoCodes.length; ++j){
            if(data[i].vendor == req.body.promoCodes[j].userid){
              if(req.body.promoCodes[j].type == 'amount'){
                   let count = 0
                   for(let k=0; k<data.length; ++k){
                    if(data[i].vendor == req.body.promoCodes[j].userid){
                      ++count
                    }
                   }
                   let discount = parseFloat(req.body.promoCodes[j].value/count).toFixed(2)
                   data[i].discount = parseFloat(parseFloat(data[i].discount) + parseFloat(discount)).toFixed(2)
              }else{
                let discount = parseInt((parseFloat(req.body.promoCodes[j].value)/100)*data[i].amount)
                data[j].discount = parseFloat(parseFloat(data[i].discount) + parseFloat(discount)).toFixed(2)
              }
            }
        }
      }
     
      let payoutdata = await Payment.insertMany(data)
      // stripepayout(data)

     
      for(let i=0; i<orderId.length; ++i){

        let order = await Order.findById(orderId[i])
        order.paymentStatus = 'paid'
       await order.save();

      }
      //places order after the payment is succesful
      for(let i=0; i<orders.length; ++i){
        if(orders[i].fromPrintful){
          let address = {
            name: orders[i].shippingAddress.name,
            address1: orders[i].shippingAddress.address,
            city: orders[i].shippingAddress.city,
            state_code: orders[i].shippingAddress.state,
            country_code: orders[i].shippingAddress.country,
            zip: orders[i].shippingAddress.postalCode,
            phone: orders[i].shippingAddress.phone,
            email: orders[i].shippingAddress.email
          }
  
          let items = []
  
          items = [...items, {
            external_variant_id: orders[i].variantId,
            quantity: orders[i].qty,
          }]

          placeOrder({
            address: address,
            items: items,
            id: orders[i]._id
          })
        }
      }

      let buff = await ContactInfo.find({})
      let information = buff[0]

      var transporter = nodemailer.createTransport({
        host: "mail.istudio.com",
        name: 'istudio.com',
        port: 465,
        auth: {
          user: process.env.EMAIL_ID,
          pass: process.env.EMAIL_PSWD
        }
      })
  
      let mailList = []
      if(req.body.statusEmail){
        mailList = [...mailList, user.email]
        mailList = [...mailList, req.body.statusEmail]
      }else{
        mailList = [...mailList, user.email]
      }

      var mailOptions = {
        from: process.env.EMAIL_ID, // sender address
        to: mailList, // list of receivers
        subject: "Order Placed", // Subject line
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" 
         xmlns:v="urn:schemas-microsoft-com:vml"
         xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
          <!--[if gte mso 9]><xml>
           <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
           </o:OfficeDocumentSettings>
          </xml><![endif]-->
          <!-- fix outlook zooming on 120 DPI windows devices -->
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- So that mobile will display zoomed in -->
          <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- enable media queries for windows phone 8 -->
          <meta name="format-detection" content="date=no"> <!-- disable auto date linking in iOS 7-9 -->
        
          <title>Receipt | Thank You for Shopping at istudio</title>
          <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet"> 
          
        <style type="text/css">
            
        body {
          margin: 0;
          padding: 0;
          color:#4a4a4a;
          font-size: 14px;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
          background-color: #ece9e2;
          -webkit-text-size-adjust: none;
            -webkit-font-smoothing: aliased;
            -moz-osx-font-smoothing: grayscale;
        }
        a, a:link { color: #2AA8F2; text-decoration: none; }
        table {	border-spacing: 0; }
        
        table td { border-collapse: collapse; }
            
        table {
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }
        
        @media screen and (max-width: 799px) {
          .container {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0px !important;
          }
        }
        @media screen and (max-width: 400px) {
          table.header h1 {
            font-size: 28px !important
          }
          table.address {
            padding-bottom: 0px !important;
          }
          table.address td {
            width: 100%;
            display: block;
            text-align: center;
            padding-bottom: 20px;
          }
          table.order-info td {
            width: 100%;
            display: block;
            text-align: center;
          }
          table.prod-info,
          table.total {
            padding: 10px 20px !important;
          }
          table.prod-info li {
            line-height: 1.3em;
          }
          table.order-details {
            font-size: 11px;
            padding-left: 10px !important;
            padding-right: 10px !important;
          }
          table.order-details table tfoot tr:first-child td {
            padding-top: 10px !important;
          }
          table.order-details table tfoot tr:last-child td {
            padding-bottom: 10px !important;
          }
          table.order-details table tfoot td {
            padding: 5px 10px !important;
          }
          .amount { width: 50px !important; }
          .total-amount { width: 70px !important; }
        }
        
        a[href^="x-apple-data-detectors:"],
        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
        }
        </style>
        
        </head>
        
        <body style="margin:0; padding:0;" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
        
        <!-- Visually Hidden Preheader Text : BEGIN -->
        <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all">
        Thank you for Shopping at istudio.
        </div>
        <!-- Visually Hidden Preheader Text : END -->
        
        <table bgcolor="white" border="0" width="800" cellpadding="0" cellspacing="0" className="container" style="margin: 15px auto;width:800px;max-width:800px; box-shadow: 0 0 10px rgba(0, 0, 0, .2); background-color: #fff;">
          <tr>
            <td>
              <table className="header" border="0" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left" className="logo" style="padding: 20px">
                    <a href="https://istudio.com/">
                      <img src="https://istudio.com/uploads/logo-1.png" alt="istudio" />
                    </a>
                  </td>
                  <td align="right" style="padding: 20px; vertical-align: middle;">
                    <a target="_blank" href="https://www.facebook.com/istudio-112915663809273/" style="display: inline-block;padding-left: 5px;">
                      <img src="https://istudio.com/uploads/facebook-icon.png" alt="Facebook" />
                    </a>
                  </td>
                </tr>
              </table>
              <table className="header" border="0" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 20px 0px 20px;">
                  <h1 style="color:#4a4a4a; font-size: 36px; margin-bottom: 30px;padding: 20px 20px 0px 20px;">Thank you for shopping at <a href="#" style="color:#4a4a4a; text-decoration: none;">istudio.</a></h1>
                  </td>
                </tr>
              </table>
              
              <table className="address" border="0" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="top" style="padding: 0 20px 20px 20px;">
                    <strong>Ship To:</strong>
                    <address style="font-style: normal; margin-top: 10px;">
                    <strong>Name :</strong> ${req.body.orders[0].shippingAddress.name}<br>
                    <strong>Address :</strong> ${req.body.orders[0].shippingAddress.address} <br>
                    ${req.body.orders[0].shippingAddress.city}, ${req.body.orders[0].shippingAddress.country}<br>
                    Zip: ${req.body.orders[0].shippingAddress.postalCode} 
                    </address>
                  </td>
                  <td valign="top" align="right" style="padding: 0 20px 20px 20px;">
                    <strong>Payment Method:</strong>
                    <span style="display: block; font-style: normal; margin-top: 10px;">${req.body.orders[0].paymentMethod}</span>
                  </td>
                </tr>
              </table>
              
              <table className="order-info" border="0" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left" style="padding: 0 20px 20px 20px;">
                    <strong style="font-size: 18px">Order #: <span style="color: #2AA8F2; letter-spacing: 1px;">#5000000098</span></strong>
                  </td>
                  <td align="right" style="padding: 0 20px 20px 20px;">
                    <strong style="font-size: 18px">Order Date: <span style="color: #2AA8F2; letter-spacing: 1px;">${((JSON.stringify(orders[0].createdAt).split('T'))[0]).split("-")[2]}/${((JSON.stringify(orders[0].createdAt).split('T'))[0]).split("-")[1]}/${(((JSON.stringify(orders[0].createdAt).split('T'))[0]).split("-")[0]).split('"')[1]}</span></strong>
                 </td>
                </tr>
              </table>
              
              <table className="order-details" border="0" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 1px; background-color:#2AA8F2;">
                <tr>
                  <td valign="top" style="padding: 0px 20px;">
                    
                    <table border="0" width="100%" cellpadding="10" cellspacing="0" style="margin-top: 1px; padding: 0px; background-color:#2AA8F2; color: #fff;">
                      <thead>
                        <tr>
                          <th align="center" style="border-bottom: 1px solid #fff;padding: 10px 20px;">Qty</th>
                          <th align="left" style="border-bottom: 1px solid #fff;padding: 10px 20px;">Product</th>
                          <th align="center" style="border-bottom: 1px solid #fff;padding: 10px 20px;">Price</th>
                          <th align="right" style="border-bottom: 1px solid #fff;padding: 10px 20px;" width="75px" className="amount">Amount</th>
                        </tr>
                      </thead>
                      <tbody>${
                        req.body.orders.map((e)=>{
                        return ( ` <tr>
                          <td align="center" style="padding: 10px 20px;">${e.qty}</td>
                          <td align="left" style="padding: 10px 20px;">${e.variantName}</td>
                         <td align="center" style="padding: 10px 20px;">$${parseFloat(e.price).toFixed(2)}</td>
                          <td align="right" style="padding: 10px 20px;">$${parseFloat(e.price)*parseInt(e.qty)}</td>
                        </tr>`)
                        })
                      }
                      </tbody>
                      <tfoot>
                        <tr>
                          <td align="right" colspan="4" style="border-top: 1px solid #fff;padding: 10px 20px;">Subtotal:</td>
                          <td align="right" style="border-top: 1px solid #fff;padding: 10px 20px;">$${price.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td align="right" colspan="4" style="color:#ffffff;padding: 10px 20px;">Discount:</td>
                          <td align="right" style="color:#ffffff;padding: 10px 20px;">$-${parseFloat(req.body.promoDiscount).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td align="right" colspan="4" style="padding: 10px 20px;">Shipping &amp; Handling:</td>
                          <td align="right" style="padding: 10px 20px;">${shippingCharge.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td align="right" colspan="4" style="padding: 10px 20px;">Sales Tax:</td>
                          <td align="right" style="padding: 10px 20px;">$0.00</td>
                        </tr>
                      </tfoot>
                    </table>
                    
                  </td>
                </tr>
              </table>
              
              <table className="total" border="0" width="100%" cellpadding="0" cellspacing="0" style="background-color: #333333; margin-top: 1px; color:#fff;">
                <tr>
                  <td align="right" colspan="4" style="padding: 15px 30px;">TOTAL:</td>
                  <td align="right" width="95px" className="total-amount" style="padding: 15px 30px;text-align: right;">$${(parseFloat(price)+parseFloat(shippingCharge)-parseFloat(req.body.promoDiscount)).toFixed(2)}</td>
                </tr>
              </table>
              
              <table border="0" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="top" style="padding: 10px 20px;">
                    <p>If you have any questions about your order, please email us at <a href="mailto:${information.supportEmail}" style="color: #2AA8F2; text-decoration: none;"><strong style="color:#2AA8F2">${information.supportEmail}</strong></a> or call <strong style="color:#2AA8F2">05 3456 342 123</strong> to speak with a customer service representative.</p>
        
                    <p>Again, thank you for shopping at <a href="#" style="color: #2AA8F2; text-decoration: none;">istudio.</a> We look forward to serving you again soon!</p>
        
                    <p>Sincerely,<br>
                    <strong style="color:#2AA8F2">The istudio Team</strong><br>
                    ${information?information.phone?information.phone : '' : ""}<br>
                    <a href="#" style="color: #2AA8F2; text-decoration: none;">istudio</a></p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
        </table>   
        </body>
        </html>
        `
      }
      
  
      try{
        let response = await transporter.sendMail(mailOptions)
      }catch(err){
        console.log(err)
      }

      let body = {
        Line: []
      }
       let cut = await PlatformFees.find({})
       let danzCut = cut[0].amount
      for(let i=0; i<orders.length; ++i){
        if(orders.fromPrintful){
          body.Line = [...body.Line, {
            JournalEntryLineDetail: {
              PostingType: "Debit", 
              AccountRef: {
                name: "Sale of product Income", 
                value: "39"
              }
            }, 
            DetailType: "JournalEntryLineDetail", 
            Amount: (parseFloat(orders[i].price)+parseFloat(orders[i].shippingCharge)).toFixed(1), 
            Id: "0", 
            Description: `Product Sold at: ${orders[i].variantName} and shipping cost: ${orders[i].shippingCharge}`
          },
          {
            JournalEntryLineDetail: {
              PostingType: "Credit", 
              AccountRef: {
                name: "Cost of sales", 
                value: "39"
              }
            }, 
            DetailType: "JournalEntryLineDetail", 
            Amount: (parseFloat(orders[i].price)).toFixed(1), 
            Id: "0", 
            Description: `Paid to Printful: $${(parseFloat(orders[i].price)+parseFloat(orders[i].shippingCharge)).toFixed(1)} `
          },
        ]
        }else{
          let cutAmount = (parseFloat(danzCut)*parseFloat(orders[i].price))/100;
          console.log(cutAmount)
          body.Line = [...body.Line, {
            JournalEntryLineDetail: {
              PostingType: "Debit", 
              AccountRef: {
                name: "Sale of product Income", 
                value: "39"
              }
            }, 
            DetailType: "JournalEntryLineDetail", 
            Amount: (parseFloat(orders[i].price)+parseFloat(orders[i].shippingCharge)).toFixed(1), 
            Id: "0", 
            Description: `Product Sold at: ${orders[i].variantName} and shipping cost: ${orders[i].shippingCharge}`
          },
          {
            JournalEntryLineDetail: {
              PostingType: "Credit", 
              AccountRef: {
                name: "Cost of sales", 
                value: "39"
              }
            }, 
            DetailType: "JournalEntryLineDetail", 
            Amount: (parseFloat(orders[i].price)-parseFloat(cutAmount)).toFixed(1), 
            Id: "0", 
            Description: `Paid to vendor: $${(parseFloat(orders[i].price)-parseFloat(cutAmount))} deducted the commision of $${cutAmount}`
          },
          {
            JournalEntryLineDetail: {
              PostingType: "Credit", 
              AccountRef: {
                name: "Freight and Shipping Costs", 
                value: "39"
              }
            }, 
            DetailType: "JournalEntryLineDetail", 
            Amount: (parseFloat(orders[i].shippingCharge)).toFixed(1), 
            Id: "0", 
            Description: `Shipping Charge: ${orders[i].shippingCharge}`
          },
          {
            JournalEntryLineDetail: {
              PostingType: "Credit", 
              AccountRef: {
                name: "Cost of sales", 
                value: "39"
              }
            }, 
            DetailType: "JournalEntryLineDetail", 
            Amount: (parseFloat(cutAmount)).toFixed(1), 
            Id: "0", 
            Description: `Sales commision to istudio: $${cutAmount}`
          },
        ]
        }
         
      }

      createJournalEntry(body)


      res.json(orders)

    }catch(err){
      res.status(500)
      console.log(err)
      throw new Error('Cannot Complete payment...')
    }
   }
})

const stripepayout = asyncHandler(async(orders)=>{

  const fees = await PlatformFees.find({})
  for(let i=0; i<orders.length; ++i){
       const user = await User.findById(orders[i].vendor)

      //  let amt = (100-fees[0].amount)
      //  let amountPayable = Math.floor((amt/100)*orders[i].price*100*orders[i].qty)
    
       if(user.userType != 'admin'){
         let payable = (parseFloat(orders[i].amount) - parseFloat(orders[i].discount))
         let cut = (parseFloat(fees[0].amount) * payable)/100
         let applicablePayout = parseInt((payable - cut)*100)

        try{
          const transfer = await stripe.transfers.create({
            amount: applicablePayout,
            currency: 'USD',
            destination: user.stripeCompanyAccountId,
            transfer_group: '{ORDER10}',
          });
        }catch(err){
          console.log("HERE")
          console.log(err)
        }
  
       }
      //  stripeCompanyAccountId

    
  }

})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

const getOrdersById = asyncHandler(async(req, res)=>{

  let pageNo = req.params.pageNo || 1
  let pageSize = 5

  let id = req.params.id
  let orders = await Order.find({user: id, isCancel: false, shipping_status:{$ne: 'Package Delivered'}})
  .limit(pageSize)
  .skip(pageSize * (pageNo - 1))
  const count = await Order.countDocuments({user: id, isCancel: false, shipping_status:{$ne: 'Package Delivered'}})

  let data = [...orders]

  for(let i=0; i<data.length; ++i){
    let obj = {}
    if(data[i].fromPrintful){
      data[i] = {
        ...data[i]._doc,
        tracking_number: "istudio",
        tracking_url_provider: "istudio"
      }
    }else{
      obj = await shippo.transaction.retrieve(data[i].shipping_transaction_id)
      console.log(obj)
      data[i] = {
        ...data[i]._doc,
        tracking_number: obj.tracking_number,
        tracking_url_provider: obj.tracking_url_provider
      }
    }
  
  }
  res.json({orders: data, page: pageNo, pages: Math.ceil(count/pageSize)})
})

const getAllOrdersById = asyncHandler(async(req, res)=>{

  let pageNo = req.params.pageNo || 1
  let pageSize = 5

  let id = req.params.id
  let orders = await Order.find({user: id})
  .limit(pageSize)
  .skip(pageSize * (pageNo - 1))
  const count = await Order.countDocuments({user: id})

  let data = [...orders]


  for(let i=0; i<data.length; ++i){
    let obj = {}, obj1 = {}
    if(data[i].fromPrintful){
      data[i] = {
        ...data[i]._doc,
        tracking_number: "istudio",
        tracking_url_provider: "istudio"
      }
    }else{
      try{
        obj = await shippo.transaction.retrieve(data[i].shipping_transaction_id)
        let response = await fetch(`https://api.goshippo.com/rates/${data[i].shipping_id}`,{
          method: 'get',
          headers: {'Authorization': `ShippoToken ${process.env.SHIPPO_SK}`}
        })
        let obj1 = await response.json()


        // let trackResponse = await fetch(`https://api.goshippo.com/tracks/shippo/${obj.tracking_number}/`,{
        //   method: 'get',
        //   headers: {'Authorization': `ShippoToken ${process.env.SHIPPO_SK}`}
        // })

        // let tracking = await trackResponse.json()
        // console.log(tracking)
  
        data[i] = {
          ...data[i]._doc,
          tracking_number: obj.tracking_number,
          tracking_url_provider: obj.tracking_url_provider,
          provider: obj1.provider,
           
        }
      }catch(err){
  console.log(err)
      }
    }
  
  }
  res.json({orders : data, page: pageNo, pages: Math.ceil(count/pageSize)})
})


//Get orders received with respect to vendor id
const vendorGetOrdersById = asyncHandler(async (req, res)=>{

  let id = req.params.id
  let orders = []
  let pageNo = req.params.pageNo || 1
  let pageSize = 5

  orders = await Order.find({vendorId: id, isCancel: false})
  .limit(pageSize)
  .skip(pageSize * (pageNo - 1))
  const count = await Order.countDocuments({vendorId: id, isCancel: false})
  
  let data = [...orders]

  for(let i=0; i<data.length; ++i){
   let obj = await shippo.transaction.retrieve(data[i].shipping_transaction_id)
   data[i] = {
     ...data[i]._doc,
     label_url: obj.label_url,
     tracking_number: obj.tracking_number,
     tracking_url_provider: obj.tracking_url_provider
   }
  }
  res.json({orders:data,page: pageNo, pages: Math.ceil(count/pageSize) })
})

const vendorGetCancelledOrdersById = asyncHandler(async (req, res)=>{

  let id = req.params.id
  let orders = []
  let pageNo = req.params.pageNo || 1
  let pageSize = 5

  orders = await Order.find({vendorId: id, isReturn: true })
  .limit(pageSize)
  .skip(pageSize * (pageNo - 1))
  const count = await Order.countDocuments({vendorId: id, isReturn: true, returnApproved: false })
  
  res.json({orders:orders,page: pageNo, pages: Math.ceil(count/pageSize) })
})

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
})

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {

  let pageNo = req.params.pageNo || 1
  let pageSize = 10
  const orders = await Order.find({})
  .limit(pageSize)
  .skip(pageSize * (pageNo - 1))

  const count = await Order.countDocuments({})
  
  let data = [...orders]

  for(let i=0; i<data.length; ++i){

   let user = await User.findById(data[i].vendorId)
   if(user){
    let name = user.name

    if(user.lastName){
       name = name +" "+user.lastName
    }
 
    data[i] = {
      ...data[i]._doc,
         vendor: name
    }
   }
   }
  
  res.json({orders:data, page: pageNo, pages: Math.ceil(count/pageSize)})
})

const cancelOrders = asyncHandler(async (req, res)=>{

  let orderId = req.params.orderId
  const order = await Order.findById(orderId)
  if(order.fromPrintful){
    try{
      let encoded = encode.encode(process.env.PRINTFUL_KEY)
    let cancelledp = await  fetch(` https://api.printful.com/orders/${order.printful_order_id}`,{
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${encoded}` },
      })
      let resp = await cancelledp.json()
    }catch(err){
      console.log(err)
    }
  }
  
  // order.isCancel = true
  // order.shipping_status = 'Order Cancelled'
  const newOrder = await Order.updateOne({_id:orderId}, {$set:{isCancel : true, reason: req.body.reason,comments: req.body.comments, shipping_status:'Order Cancelled'}}) 
  const payment = await Payment.findOne({orderId: orderId})

  try{
    if(order.shipping_status == 'Order Created'){
      let amount = parseInt(parseFloat(payment.amount + payment.shipping)*100)
     const refund = await stripe.refunds.create({
       charge: payment.stripeChargeId,
       amount: amount
     });
   console.log(refund)
   }
  }catch(err){
    console.log(err)
  }
   

  let userNotification = {
                user: order.user,
                notification: `Your order for ${order.productName} was cancelled`,
                image: `${process.env.BASE_URL}/${order.productImage}`
  }
  let vendorNotification = {
                user: order.vendorId,
                notification: `Order for ${order.productName} was cancelled by ${order.shippingAddress.name}`,
                image: `${process.env.BASE_URL}/${order.productImage}`
  }

   await Notifications.insertMany([userNotification, vendorNotification])

  let response = await shippo.refund.create({
    "transaction": order.shipping_transaction_id,
     });
  
  res.json(newOrder)

})

const cancelledOrders = asyncHandler(async (req, res)=>{

  let pageNo = req.params.pageNo || 1
  let pageSize = 5

  let id = req.params.id
  let cancelledOrders = await Order.find({user: id, isCancel: true}) 
  .limit(pageSize)
  .skip(pageSize * (pageNo - 1))

  const count = await Order.countDocuments({user: id, isCancel: true})

  res.json({orders:cancelledOrders, page: pageNo, pages: Math.ceil(count/pageSize)})

})

const getDeliveredOrders = asyncHandler(async(req, res)=>{

  let pageNo = req.params.pageNo || 1
  let pageSize = 5
  let id = req.params.id
  let orders = await Order.find({user: id, $or:[{shipping_status: 'Package Delivered'},{shipping_status: 'Package Returned'}] })
  .limit(pageSize)
  .skip(pageSize * (pageNo - 1))

  let deliveredOrders = []

  for(let i=0; i<orders.length; ++i){
    let product = await Product.findById(orders[i].productId)
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date();
    const secondDate = new Date(orders[i].updatedAt);
    
    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    
    deliveredOrders = [...deliveredOrders, {...orders[i]._doc, canBeReturned: product.hasReturnOption? diffDays<=product.returnDays?true:false : false }]
  }
  const count = await Order.countDocuments({user: id, shipping_status: 'Package Delivered'})

  res.json({orders:deliveredOrders, page: pageNo, pages: Math.ceil(count/pageSize)})

})

const approveReturnOrder = asyncHandler(async(req, res)=>{

  let id = req.params.id
 
  let order = await Order.findById(id)
  let vendor = await User.findById(order.vendorId)
  let user  = await User.findById(order.user)
  let payment = await Payment.findOne({orderId: id})


  try{

    const reversal = await stripe.transfers.createReversal(
      payment.payout_id,
      {amount: parseInt(payment.amount_paid*100)}
    );

    console.log(reversal)
   
      let amount = parseInt(payment.amount)
     const refund = await stripe.refunds.create({
       charge: payment.stripeChargeId,
       amount: parseInt(amount*100)
     });
   console.log(refund)
 
  }catch(err){
    console.log(err)
  }

  try{
    const customer = await stripe.customers.update(vendor.stripeId, {
      default_source: req.body.card
    });
  }catch(err){
  console.log(err)
  }

  const stripeAddress=order.BillingAddress.address+", "+order.BillingAddress.city+", "+order.BillingAddress.country+", Zip:"+order.BillingAddress.postalCode


  let param = {
    amount: parseInt(parseFloat(req.body.amount)*100),
    currency: 'USD',
    description: 'Return Order Payment',
    customer: vendor.stripeId,
    metadata:{
      name: vendor.name,
      address: stripeAddress
    }
  }
    //Charge a customer

    try{
      let customerCharge = await stripe.charges.create(param)

      let shipping_obj = await shippo.transaction.create({
        "rate": req.body.shipping_obj_id,
        "label_file_type": "PDF",
        "async": false
    })
    order.returnApproved = true
    order.return_shipping_obj_id = req.body.shipping_obj_id
    order.return_shipping_transaction_id = shipping_obj.object_id
    order.return_shipping_label = shipping_obj.label_url
    order.return_tracking = shipping_obj.tracking_url_provider
    order.shipping_status = 'Package Returned'

   const newOrder = await order.save()

   //sending mail
    sendMail(user, shipping_obj, order)

    res.json({msg: 'Return Approved'})
    }catch(err){
      console.log(err)
      res.status(400).json({msg: 'Return Not Approved'})
    }
})

const sendMail = asyncHandler(async(user, shipping_obj, orderSum)=>{

  let buff = await ContactInfo.find({})
  let information = buff[0]

  var transporter = nodemailer.createTransport({
    host: "mail.istudio.com",
    name: 'istudio.com',
    port: 465,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PSWD
    }
  })
  var mailOptions = {
    from: process.env.EMAIL_ID, // sender address
    to: user.email, // list of receivers
    subject: "Order Return Request Approved", // Subject line
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" 
     xmlns:v="urn:schemas-microsoft-com:vml"
     xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <!--[if gte mso 9]><xml>
       <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
       </o:OfficeDocumentSettings>
      </xml><![endif]-->
      <!-- fix outlook zooming on 120 DPI windows devices -->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- So that mobile will display zoomed in -->
      <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- enable media queries for windows phone 8 -->
      <meta name="format-detection" content="date=no"> <!-- disable auto date linking in iOS 7-9 -->
    
      <title>Receipt | Thank You for Shopping at istudio</title>
      <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet"> 
      
      <style type="text/css">
	  
      body {
        margin: 0;
        padding: 0;
        color:#4a4a4a;
        font-size: 14px;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        background-color: #ece9e2;
        -webkit-text-size-adjust: none;
          -webkit-font-smoothing: aliased;
          -moz-osx-font-smoothing: grayscale;
      }
      a, a:link { color: #2AA8F2; text-decoration: none; }
      table {	border-spacing: 0; }
      
      table td { border-collapse: collapse; }
          
      table {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      
      @media screen and (max-width: 799px) {
        .container {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0px !important;
        }
      }
      @media screen and (max-width: 400px) {
        table.header h1 {
          font-size: 28px !important
        }
        table.address {
          padding-bottom: 0px !important;
        }
        table.address td {
          width: 100%;
          display: block;
          text-align: center;
          padding-bottom: 20px;
        }
        table.order-info td {
          width: 100%;
          display: block;
          text-align: center;
        }
        table.prod-info,
        table.total {
          padding: 10px 20px !important;
        }
        table.prod-info li {
          line-height: 1.3em;
        }
        table.order-details {
          font-size: 11px;
          padding-left: 10px !important;
          padding-right: 10px !important;
        }
        table.order-details table tfoot tr:first-child td {
          padding-top: 10px !important;
        }
        table.order-details table tfoot tr:last-child td {
          padding-bottom: 10px !important;
        }
        table.order-details table tfoot td {
          padding: 5px 10px !important;
        }
        .amount { width: 50px !important; }
        .total-amount { width: 70px !important; }
      }
      
      a[href^="x-apple-data-detectors:"],
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }
      </style>
    
    </head>
    
    <body style="margin:0; padding:0;" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
    
    <!-- Visually Hidden Preheader Text : BEGIN -->
    <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all">
    Thank you for Shopping at istudio.
    </div>
    <!-- Visually Hidden Preheader Text : END -->
    
    <table bgcolor="white" border="0" width="800" cellpadding="0" cellspacing="0" className="container" style="margin: 15px auto;width:800px;max-width:800px; box-shadow: 0 0 10px rgba(0, 0, 0, .2); background-color: #fff;">
      <tr>
        <td>
          <table className="header" border="0" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="left" className="logo" style="padding: 20px">
                <a href="https://istudio.com">
                  <img src="https://istudio.com/uploads/logo-1.png" alt="istudio" />
                </a>
              </td>
              <td align="right" style="padding: 20px; vertical-align: middle;">
                <a target="_blank" href="https://www.facebook.com/istudio-112915663809273/" style="display: inline-block;padding-left: 5px;">
                  <img src="https://istudio.com/uploads/facebook-icon.png" alt="Facebook" />
                </a>
              </td>
            </tr>
          </table>
          <table className="header" border="0" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding: 20px 20px 0px 20px;">
              <h1 style="color:#4a4a4a; font-size: 36px; margin-bottom: 30px;padding: 20px 20px 0px 20px;">Thank you for shopping at <a href="#" style="color:#4a4a4a; text-decoration: none;">istudio.</a></h1>
              </td>
            </tr>
          </table>
          
          <table className="header" border="0" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="left" style="padding: 20px 20px 0px 20px;">
              <p style=" text-align: left;">${user.name},</p>
              <p style="font-size: 22px;font-weight: 800;margin-bottom: 0;padding-bottom: 0;">Your return is confirmed.</p>
              <p>We have received your return request. The vendor has approved your retuer request and scheduled a pickup. Please keep the item ready for pickup.</p>
             
            </td>
          </tr>
        </table>

        <table border="0" width="100%" cellpadding="10" cellspacing="0" style="margin-top: 1px; padding: 0px; background-color:#2AA8F2; color: #fff;">
        <thead>
          <tr>
            <th align="center" style="border-bottom: 1px solid #fff;padding: 10px 20px;">Qty</th>
            <th align="left" style="border-bottom: 1px solid #fff;padding: 10px 20px;">Product</th>
            <th align="center" style="border-bottom: 1px solid #fff;padding: 10px 20px;">Price</th>
            <th align="right" style="border-bottom: 1px solid #fff;padding: 10px 20px;" width="75px" className="amount">Amount</th>
          </tr>
        </thead>
        <tbody>
         <tr>
            <td align="center" style="padding: 10px 20px;">${orderSum.qty}</td>
            <td align="left" style="padding: 10px 20px;">${orderSum.variantName}</td>
           <td align="center" style="padding: 10px 20px;">$${parseFloat(orderSum.price).toFixed(2)}</td>
            <td align="right" style="padding: 10px 20px;">$${parseFloat(orderSum.price)*parseInt(orderSum.qty)}</td>
          </tr>
        
        </tbody>
        <tfoot>
          <tr>
            <td align="right" colspan="4" style="padding: 10px 20px;">Sales Tax:</td>
            <td align="right" style="padding: 10px 20px;">$0.00</td>
          </tr>
        </tfoot>
      </table>
          
        <table border="0" width="100%" cellpadding="0" cellspacing="0">
				<tr>
					<td valign="top" style="padding: 10px 20px;border-top: 1px solid #000000;">
						<p style="color: #000000;font-weight: 800;font-size: 20px;">Important!</p>
						<p>Kindly handover the item with all original tags intact, including the MRP tag at the time of pickup.</p>
            <p>Kindly paste the return label on the box, to get the return label <a href='${shipping_obj.label_url}'>click here</a></p>
            <p style="color: #ff0000">Without the shipping label your order will not be returned.</p>
					</td>
				</tr>
			</table>
			<table border="0" width="100%" cellpadding="0" cellspacing="0">
				<tr>
					<td valign="top" style="padding: 10px 20px;border-top: 1px solid #000000;border-bottom: 1px solid #000000;">
						<p style="color: #7e8c8d;font-size: 14px;">
							DELIVERY: STANDARD<br />
							MODE OF PAYMENT: CARD
						</p>
					</td>
				</tr>
			</table>
          
          <table border="0" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td valign="top" style="padding: 10px 20px;">
                <p>If you have any questions about your order, please email us at <a href="mailto:${information.supportEmail}" style="color: #2AA8F2; text-decoration: none;"><strong style="color:#2AA8F2">${information.supportEmail}</strong></a> or call <strong style="color:#2AA8F2">05 3456 342 123</strong> to speak with a customer service representative.</p>
    
                <p>Again, thank you for shopping at <a href="#" style="color: #2AA8F2; text-decoration: none;">istudio.</a> We look forward to serving you again soon!</p>
    
                <p>Sincerely,<br>
                <strong style="color:#2AA8F2">The istudio Team</strong><br>
                ${information?information.phone?information.phone : '' : ""}<br>
                <a href="#" style="color: #2AA8F2; text-decoration: none;">istudio</a></p>
              </td>
            </tr>
          </table>
          
        </td>
      </tr>
    </table>   
    </body>
    </html>
    `
  }
  

  try{
    let response = await transporter.sendMail(mailOptions)
    console.log(response)
  }catch(err){
    console.log(err)
  }


})

const requestReturnOrder = asyncHandler(async(req, res)=>{
  let id = req.params.id

  const order = await Order.findById(id)
  if(order){
     order.isReturn = true
     let newOrder = await order.save()
     res.json({order: newOrder ,msg: 'Return request raised'})
  }else{
    res.status(404).json({msg: 'Order details not found'})
  }

})

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getOrdersById,
  vendorGetOrdersById,
  cancelOrders,
  cancelledOrders,
  getDeliveredOrders,
  getAllOrdersById,
  vendorGetCancelledOrdersById,
  approveReturnOrder,
  requestReturnOrder
}
