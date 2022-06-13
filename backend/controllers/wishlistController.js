import asyncHandler from 'express-async-handler'
import wishlist from '../models/wishlistModel.js'
import Product from '../models/productModel.js'
import encode from 'base-64'
import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'

//Add Product to wishlist

const addToWishlist = asyncHandler(async (req, res)=>{

          const listexists = await wishlist.findOne({userId: req.body.userId, productId: req.body.productId})
          
          if(listexists){
                    res.status(400)
                    throw new Error('Already in wishlist')               
          }

          const wish = await wishlist.create(req.body)

          if(wish){
                    res.status(201).json({"status":"success",
                    "data":wish,
                     })
          }
          else{
                    res.status(400)
                    throw new Error('Invalid variants data')
          }
          

})

const removeFromWishlist = asyncHandler(async (req, res)=>{

          const id = req.params.id
          const pid = req.params.productId
          const wish = await wishlist.findOne({userId: id, productId: pid})

          if(wish){
                 
                    await wish.remove()
                     res.json({"status":"success", message: 'Removed' })

          }else{
                    res.status(404)
                    throw new Error('Not Found')
          }

})

const getAllWishlist = asyncHandler(async (req, res)=>{

          let token = req.headers.authorization.split(' ')[1]
          let userid = jwt.verify(token, process.env.JWT_SECRET)
          const list  = await wishlist.find({userId: userid.id})
          
          let data = []
          for(let i=0; i<list.length; ++i){
                    data = [...data, list[i].productId]
          }


          res.status(200).json(data)
          

})

const getProductIdFromWishlist = asyncHandler(async (req, res)=>{
           
          let id = req.params.id

          const list = await wishlist.find({userId: id})

          let data = [];

          for(let i = 0; i<list.length; ++i){
                    

                    if(list[i].fromPrintful){
                        
                              let encoded = encode.encode(process.env.PRINTFUL_KEY)

                              let config = {
                                        headers: {
                                                  "Authorization" : `Basic ${encoded}`
                                        }
                              }
                            let res = await  fetch(`https://api.printful.com/store/products/@${list[i].productId}`, config)
                              let response =  await res.json()
                    
                              console.log(response.result.sync_product)
                              let data1 ={
                                        _id: response.result.sync_product.external_id,
                                        name: response.result.sync_product.name,
                                        thumbnailImage: response.result.sync_product.thumbnail_url,
                                        brand: 'istudio'
                              }

                              data = [...data, data1]
                                       

                    }else{

                              const product = await Product.findById(list[i].productId)
                              if(product){
                                        data = [...data, product]
                              }
                    }              
                   
          }
          console.log(data)
         res.status(200).json({
                   data: data
         }) 
         
})

export {
          addToWishlist,
          removeFromWishlist,
          getAllWishlist,
          getProductIdFromWishlist
}

