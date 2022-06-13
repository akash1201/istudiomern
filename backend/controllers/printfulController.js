import asyncHandler from 'express-async-handler'
import encode from 'base-64'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import Order from '../models/orderModel.js'
import wishlist from '../models/wishlistModel.js'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
// var shippo = require('shippo')(process.env.SHIPPO_SK);

dotenv.config()

const getProducts = asyncHandler(async(req, res)=>{

    let pageNo = req.params.pageNo? req.params.pageNo : 1
    let offset = ((pageNo-1)*10)

let encoded = encode.encode(process.env.PRINTFUL_KEY)

let config = {
          headers: {
                    "Authorization" : `Basic ${encoded}`
          }
}
let response = await fetch(`https://api.printful.com/store/products?offset=${offset}&limit=10`, config)

let result = await response.json()
let products = result.result
           
    if(req.headers.authorization){
        let token = req.headers.authorization.split(' ')[1]
        let userid = jwt.verify(token, process.env.JWT_SECRET)
        for(let i=0; i<products.length; ++i){

            let isPresent = await wishlist.findOne({productId: products[i].external_id, userId: userid.id})
            if(isPresent){
                products[i] = {...products[i], existsInWishlist: true}
              }else{
                products[i] = {...products[i], existsInWishlist: false}
              }
        }
        
    }

          // console.log(json)
          res.json({products: products, paging: result.paging.total})

})

const getProductVariants = asyncHandler(async(req, res)=>{
          let id = req.params.id
          let encoded = encode.encode(process.env.PRINTFUL_KEY)
          let admin = await User.findOne({userType: 'admin'})

          let config = {
                    headers: {
                              "Authorization" : `Basic ${encoded}`
                    }
          }
         let response = await fetch(`https://api.printful.com/store/products/@${id}`, config)
          let json = await response.json()
          
          if(req.headers.authorization){
            let token = req.headers.authorization.split(' ')[1]
            let userid = jwt.verify(token, process.env.JWT_SECRET)
            
          let isInWishlist = await wishlist.findOne({productId: id, userId: userid.id})

          if(isInWishlist){
            json.result.sync_product.existsInWishlist = true
            json.result.sync_product.user = admin._id
          }else{
            json.result.sync_product.existsInWishlist = false
            json.result.sync_product.user = admin._id
          }
           

          }
                    // console.log(json)
                    res.json(json.result)
        
})

const getRates = asyncHandler (async(req, res)=>{

          let encoded = encode.encode(process.env.PRINTFUL_KEY)

          let address = req.body.address
          let items = req.body.product


          let body = {
                    recipient: address,
                    items: items
          }
    
          fetch(`https://api.printful.com/orders/estimate-costs`,{
                    method: 'POST',
                    body:    JSON.stringify(body),
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${encoded}` },
                })
          .then(res => res.json())
          .then((json)=>{

                    res.json(json.result)
          })
})

const placeOrder = asyncHandler( async(req)=>{

          let encoded = encode.encode(process.env.PRINTFUL_KEY)

          let address = req.address
          let items = req.items
          let id = req.id

          let body = {
                    recipient: address,
                    items: items
          }
          fetch(`https://api.printful.com/orders`,{
                    method: 'POST',
                    body:    JSON.stringify(body),
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${encoded}` },
                })
          .then(res => res.json())
          .then((json)=>{
            updatePrintfulOrderId(json, id)
          })

})

//updates the order in local db with prinful order id
const updatePrintfulOrderId = asyncHandler(async(json, id)=>{
    let order = await Order.findById(id)
    order.printful_order_id = json.result.id
    let obj = await order.save()
       return(json.result)
})

const cancelOrder = asyncHandler( async(req, res)=>{

          let encoded = encode.encode(process.env.PRINTFUL_KEY)

          let id = req.params.orderId

          try{
            fetch(` https://api.printful.com/orders/${id}`,{
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${encoded}` },
            })
      .then(res => res.json())
      .then((json)=>{
           
                res.json(json.result)
      })
          }catch(err){
            console.log(err)
          }
})

const updateOrderStatus = asyncHandler( async (req, res)=>{

    let orderId = req.body.data.order.id

    console.log(req.body.data.order.id)

    let order = await Order.findOne({printful_order_id: orderId})

    switch(req.body.type){

        case 'package_shipped':
              order.shipping_status = 'Package Shipped'     
        break;

        case 'package_returned':
            order.isCancel = true
            order.shipping_status = 'Package Returned'
        break;

        case 'order_failed':
            order.isCancel = true
            order.shipping_status = 'Order Failed'
        break;

        case 'order_canceled':
            order.isCancel = true
            order.shipping_status = 'Order Cancelled'
        break;

        default:
              console.log("DEfault")
    }

     let newObj = await order.save()
     res.json(newObj)


})

export {
          getProducts,
          getProductVariants,
          getRates,
          placeOrder,
          cancelOrder,
          updateOrderStatus
}
