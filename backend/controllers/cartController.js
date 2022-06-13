import asynchandler from 'express-async-handler'
import Cart from "../models/cartModel.js"
import jwt from 'jsonwebtoken'
import Product from "../models/productModel.js"
import encode from 'base-64'
import fetch from 'node-fetch'
import Wishlist from '../models/wishlistModel.js'
import User from '../models/userModel.js'

const addItemToCart = asynchandler(async(req, res)=>{

 
         let token = req.headers.authorization.split(' ')[1]
         const decoded = jwt.verify(token, process.env.JWT_SECRET)
         let cartData = {
              user: decoded.id,
              product: req.body.product,
              variantId: req.body.variantId,
              fromPrintful: req.body.fromPrintful,
              qty: req.body.qty
         }
         

          const cartItems = await Cart.findOne({user: decoded.id, variantId: req.body.variantId})
          if(cartItems){
                    res.status(400)
                    throw new Error('Already exists')
          }else{
                const cartItems = await Cart.create(cartData)
                res.json(cartItems)
          }



})

const removeFromCart = asynchandler( async( req, res)=>{

     let token = req.headers.authorization.split(' ')[1]

     const decoded = jwt.verify(token, process.env.JWT_SECRET)
          let variantId = req.params.variantId

          const cartItems = await Cart.findOne({user: decoded.id, variantId: variantId})
          if(cartItems){
               await cartItems.remove()
              res.json({message: 'Item Removed'})
          }else{
               res.status(400)
               throw new Error('Item not in cart')
          }

})

const updateCartItems = asynchandler(async(req, res)=>{

     let token = req.headers.authorization.split(' ')[1]

     const decoded = jwt.verify(token, process.env.JWT_SECRET)
          let variantId = req.params.variantId

          const cartItems = await Cart.findOne({user: decoded.id, variantId: variantId})
          if(cartItems){
                    if(req.body.qty < 0){
                              if(cartItems.qty > 1){
                                        cartItems.qty =parseInt(cartItems.qty)+parseInt(req.body.qty)
                                        const newCart = await cartItems.save()
                                        res.json(newCart)
                              }else{
                                   res.json(cartItems)
                              }
                    }else{
                              cartItems.qty =parseInt(cartItems.qty)+parseInt(req.body.qty)
                              const newCart = await cartItems.save()
                              res.json(newCart)    
                    }
               
          }else{
               res.status(400)
               throw new Error('Item not in cart')
          }
})

const getCartItems = asynchandler( async(req, res)=>{

         let token = req.headers.authorization.split(' ')[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
     
          const cartItems = await Cart.find({user: decoded.id})
          let admin = await User.findOne({userType: 'admin'})
          let data = [];

          for(let i=0; i<cartItems.length; ++i){
               if(!cartItems[i].fromPrintful){
                    let base = await Product.findById(cartItems[i].product)
                    let variant = await Product.findById(cartItems[i].variantId)
                    let existsInWishlist = await Wishlist.findOne({userId: decoded.id, productId: base._id})
                    data = [...data, {
                         user: cartItems[i].user,
                         product: cartItems[i].product,
                         variantId: cartItems[i].variantId,
                         name: base.name,
                         brand: base.brand?base.brand:"",
                         image: variant.images[0],
                         price: variant.offerPrice? variant.offerPrice : variant.price,
                         base: base,
                         variant: variant,
                         fromPrintful: cartItems[i].fromPrintful,
                         qty: cartItems[i].qty,
                         vendor: base.user,
                         existsInWishlist: existsInWishlist?true:false
                    }]
               }else{
                    let encoded = encode.encode(process.env.PRINTFUL_KEY)
                    let config = {
                              headers: {
                                        "Authorization" : `Basic ${encoded}`
                              }
                    }
                 let response = await fetch(`https://api.printful.com/store/products/@${cartItems[i].product}`, config)
                   let json = await response.json()
                   let base = json.result.sync_product
                   let variant = json.result.sync_variants.filter((e)=>e.external_id == cartItems[i].variantId)
                   let existsInWishlist = await Wishlist.findOne({userId: decoded.id, productId: base._id})
                   
                   data = [...data, {
                    user: cartItems[i].user,
                    product: cartItems[i].product,
                    variantId: cartItems[i].variantId,
                    vid: variant[0].variant_id,
                    name: variant[0].name,
                    brand: "istudio",
                    image: (variant[0].files.filter((e)=>e.type === 'preview'))[0].thumbnail_url,
                    price: variant[0].retail_price,
                    base: base,
                    variant: variant[0],
                    fromPrintful: cartItems[i].fromPrintful,
                    qty: cartItems[i].qty,
                    vendor: admin._id,
                    existsInWishlist: existsInWishlist?true:false
               }]

               }
              
          }
          res.json(data)
})

const syncCart = asynchandler(async(req, res)=>{

     let data = req.body

     for(let i=0; i<data.length; ++i){
          const cartData = await Cart.findOne({user: data[i].user, variantId: data[i].variantId})
          if(!cartData){
               await Cart.create(data)
          }
     }
     res.json({message : "Synced"})
})

const clearCart = asynchandler(async(req, res)=>{

     let token = req.headers.authorization.split(' ')[1]
     const decoded = jwt.verify(token, process.env.JWT_SECRET)
     
     try{
          await Cart.deleteMany({"user" : decoded.id})
          res.json({message:"Succesfully deleted"})
     }catch(err){
          res.status(400)
          res.json({message:"Error"})
     }

     
})

export { addItemToCart, removeFromCart, updateCartItems, getCartItems, syncCart, clearCart }