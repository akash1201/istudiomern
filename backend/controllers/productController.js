import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import wishlist from '../models/wishlistModel.js'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import Report from '../models/reportModel.js'
import User from '../models/userModel.js'
import Category from '../models/categoryModel.js'
import mongodb from 'mongodb'
const ObjectId = mongodb.ObjectID

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {

  const pageSize = Number(req.query.pageSize) || 24
  const page = Number(req.query.pageNumber) || 1
  const minPrice = Number(req.query.minPrice) || 0
  const maxPrice = Number(req.query.maxPrice) || 100000000
  const featured = Boolean(req.query.featured) || false
  console.log(featured)

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

    let query = {}

    if(featured){
      query = { ...keyword, active: true, featured: true 
        ,$or:
        [{offerPrice: {$gte: minPrice, $lt: maxPrice} },
     {price: {$gte: minPrice, $lt: maxPrice}}],
     } 
    }else{
      query = { ...keyword, active: true 
        ,$or:
        [{offerPrice: {$gte: minPrice, $lt: maxPrice}},
     {price: {$gte: minPrice, $lt: maxPrice}}],
     } 
    }
  const count = await Product.countDocuments(query)

  const products = await Product.find(query)
    .limit(pageSize)
    .skip(pageSize * (page - 1))

    let data = products;
    if(req.headers.authorization){
      let token = req.headers.authorization.split(' ')[1]
      let userid = jwt.verify(token, process.env.JWT_SECRET)

        for(let i = 0; i<products.length; ++i){
                data = []
                let isPresent = await wishlist.findOne({productId: products[i].id, userId: userid.id})
                if(isPresent){
                  products[i] = {
                    ...products[i]._doc,
                    existsInWishlist: true
                  }
                }else{
                  products[i] = {
                    ...products[i]._doc,
                    existsInWishlist: false
                  }
                }  
        }
    }
     
  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

const getCategoryProducts = asyncHandler(async (req, res) => {

  const id = req.params.categoryId
  const pageSize = 24
  const page = Number(req.query.pageNumber) || 1


  const count = await Product.countDocuments({  "$or": [{
                                                          category: id
                                                      }, 
                                                      { subcategory: { $all: [id] } }
                                                    ], active: true })

  const products = await Product.find({  "$or": [{
                                                  category: id
                                              }, 
                                              { subcategory: { $all: [id] } }
                                            ], active: true })
                                                  .limit(pageSize)
                                                  .skip(pageSize * (page - 1))

  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

const getProductsAll = asyncHandler(async (req, res) => {

  const pageSize = Number(req.query.pageSize) || 10
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}
  
  const id = req.params.id
  const products = await Product.find({...keyword, parentid: 'parent',active: true, user:id})
                                                                                .limit(pageSize)
                                                                                .skip(pageSize * (page - 1))
  const count = await Product.countDocuments({ ...keyword, parentid: 'parent',active: true, user:id  })

  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id)

  if(req.headers.authorization && product){
    let token = req.headers.authorization.split(' ')[1]
    let userid = jwt.verify(token, process.env.JWT_SECRET)
    
    let isPresent = await wishlist.findOne({productId: product._id, userId: userid.id})

   if(isPresent){
     product = {...product._doc, existsInWishlist: true}
   }else{
    product = {...product._doc, existsInWishlist: false}
   }
  }
  
  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

const getProductVariant = asyncHandler(async (req, res) => {

  const variants = await Product.find({parentid: req.params.id})
  

  if(variants){
    res.json(variants)
  }else{
    res.json([])
  }
 
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  const deleteVariant = await Product.deleteMany({parentid: req.params.id})


  if (product) {
    await product.remove()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {


  // const {
  //   name,
  //   price,
  //   image,
  //   brand,
  //   category,
  //   countInStock,
  //   numReviews,
  //   description
  // } = req.body


  // const product = new Product({
  //   name: name,
  //   price: price,
  //   user: req.user._id,
  //   image: image,
  //   brand: brand,
  //   category: category,
  //   countInStock: countInStock,
  //   numReviews: numReviews,
  //   description: description,
  // })
  const product = new Product(req.body)

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  
  const product = await Product.findById(req.params.id)

  if (product) {

    product.name = req.body.name
    product.price = req.body.price
    product.qty = req.body.qty
    product.variant = req.body.variant
    product.slug = req.body.slug
    product.category = req.body.category
    product.brand = req.body.brand?req.body.brand: ""
    product.subcategory = req.body.subcategory
    product.thumbnailImage = req.body.thumbnailImage?req.body.thumbnailImage : ""
    product.images = req.body.images?req.body.images : product.images
    product.description = req.body.description
    product.offerPrice = req.body.offerPrice
    product.featured = req.body.featured
    product.dimensions = req.body.dimensions 
    product.hasReturnOption = req.body.hasReturnOption
    product.returnDays = req.body.returnDays
    product.specs = req.body.specs

    // product.image = image
    product.availableVariants = req.body.availableVariants

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  

  const { rating, comment, images } = req.body;
  
  console.log(req.body)

  const product = await Product.findById(req.params.id)
  

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment:comment,
      images: images,
      user: req.user._id,
    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating =
      parseFloat(product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length).toFixed(1)

    await product.save()
    res.status(201).json({ message: 'Review added',details:product.reviews })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {

  let categoryId = req.params.categoryId

  const products = await Product.find({category: categoryId, parentid: 'parent'}).sort({ rating: -1 }).limit(5)

  res.json(products)
})

const getFeaturedProducts = asyncHandler(async (req, res) => {

  let categoryId = req.params.categoryId

  const products = await Product.find({category: categoryId, parentid: 'parent', featured: true}).sort({ rating: -1 }).limit(5)

  res.json(products)
})

const updateAvailableOptions = asyncHandler(async (req, res) => {
  
  console.log(req.body)
  console.log(req.params.id)
  const updatedProduct = await Product.updateOne({'_id':req.params.id},{$set:{'availableVariantOption':req.body}})
  console.log(updatedProduct)
   res.json(updatedProduct)

  
})
const updateActive = asyncHandler(async (req, res) => {
  
  const product = await Product.findById(req.params.id)
   product.active = req.body.status 
   const updatedProduct = await product.save()
   res.json(updatedProduct)

  
})

const reportProduct = asyncHandler(async(req, res)=>{
  let reportObj = await Report.findOne({userId: req.body.userId, productId: req.body.productId})
  if(reportObj){
    res.status(500)
    throw new Error('Already reported')
  }
 
  try{
    let report = await Report.create(req.body)
    res.status(200).json(report)
  }catch(err){
    console.log(err)
    res.status(500)
    throw new Error('Cannot report. Try again later.')
  }
  
  })

const getProductAndCategory = asyncHandler(async (req, res)=>{

let vendorId = req.params.vendorId
let categories = []

let products = await Product.find({user: vendorId, parentid: 'parent'})
for(let i=0; i<products.length; ++i){
  if(!categories.includes(products[i].category.toString())){
    categories = [...categories, products[i].category.toString()]
  }
}
let obj = {
           vendor : {},
           data: []
}

let vendor = await User.findById(vendorId)
 let buff = {
   name: vendor.lastName?vendor.name+" "+vendor.lastName : vendor.name,
   role: vendor.userType,
   profilePic: vendor.profilePic ? vendor.profilePic : '/assets/img/logo.png'
 }
 obj.vendor = buff
 
 for(let i=0; i<categories.length; ++i){
   let category = await Category.findById(categories[i])
   let products = await Product.find({user: vendorId, parentid: 'parent',category: ObjectId(categories[i])})
   
   let data = {
     categoryId: category._id,
     category: category.name,
     products: products
   }

   obj.data = [...obj.data, data]
 }

 res.json(obj)

})
export {
  getProductAndCategory,
  reportProduct,
  updateAvailableOptions,
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getProductVariant,
  getFeaturedProducts,
  updateActive,
  getProductsAll,
  getCategoryProducts
}
