import asyncHandler from 'express-async-handler'
import CategoryModel from '../models/categoryModel.js'
import express from 'express'


const app = express()
// @route   POST /api/category/add
const registerCategory = asyncHandler(async (req,res) => {
  const {image,name,active,slug,parentid} = req.body;


  //same as other product api
  const categoryExists = await CategoryModel.findOne({ name })//

  // if (categoryExists) {
  //   res.status(400)
  //   throw new Error('category already exists')
  // }

  const category = await CategoryModel.create({
    image,
    name,
    active,
    slug,
    parentid
  })

  if (category) {
    getCategoryAll(req, res)
    // res.status(201).json({
    //   _id: category._id,
    //   image:category.image,
    //   name: category.name,
    //   active:category.active,
    //   slug:category.slug,
    //   parentid:category.parentid, 
    //   token: generateToken(category._id),
    // })
  } else {
    res.status(400)
    throw new Error('Invalid category data')
  }


})


// @route   PUT /api/category/profile
const updateCategory = asyncHandler(async (req, res) => {
  console.log(req.body)
  const category = await CategoryModel.findById(req.body.id)
 console.log(category)
  if (category) {
    category.image = req.body.image || category.image
    category.name = req.body.name || category.name
    category.active = req.body.active || category.active
    category.slug = req.body.slug || category.slug
    category.parentid = req.body.parentid || category.parentid
   

    const updatedCategory = await category.save()

    getCategoryAll(req, res)
    // res.json({
    //   msg :"updated successfully",
    //   _id: updatedCategory._id,
    //   image: updatedCategory.image,
    //   name: updatedCategory.name,
    //   slug:updatedCategory.slug,
    //   parentid:updateCategory.parentid,
    //   token: generateToken(updatedCategory._id),
    // })
  } else {
    res.status(404)
    throw new Error('category not updated')
  }
})

// @route   GET /api/all
let allcategory = [];
const getCategoryAll = asyncHandler(async (req, res) => {
  allcategory = await CategoryModel.find({})
  var data = []

  for(let i =0 ; i < allcategory.length; ++i){
    
    if(allcategory[i].parentid == "parent"){
      data.push({
        _id: allcategory[i]._id,
        parentid: 'parent',
        key: allcategory[i]._id,
        slug: allcategory[i].slug,
        name: allcategory[i].name,
        title: allcategory[i].name,
        value: allcategory[i]._id,
        image: allcategory[i].image,
        children: getChildren(allcategory[i]._id)
      })
    }

  }

   return res.send({"status":"success","data": data})
   })

const getChildren = (id) => {
 
  let cData = [];

  for(let i =0; i<allcategory.length; ++i){
    if(allcategory[i].parentid == id){
         cData.push({
          _id: allcategory[i]._id,
          parentid: allcategory[i].parentid,
          key: allcategory[i]._id,
          name: allcategory[i].name,
          slug: allcategory[i].slug,
          title: allcategory[i].name,
          value: allcategory[i]._id,
          image: allcategory[i].image,
          children: getChildren(allcategory[i]._id)
         })
    }
  }
return cData;
} 





// @route   DELETE /api/CategoryModels/:id
const deleteCategory = asyncHandler(async (req, res) => {
  console.log(req);
  const category = await CategoryModel.findById(req.params.id)

  if (category) {
    await category.remove()
    // res.json({ message: 'category removed' })
    getCategoryAll(req, res)
  } else {
    res.status(404)
    throw new Error('category not found')
  }
})

// @route   GET /api/CategoryModels/:id
const getCategoryById = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const category = await CategoryModel.find( { name :  name  } )
  console.log(category[0].parentid) 
  const children = await CategoryModel.find({"parentid":category[0]._id})
  if(children){
  console.log(Object.values(children))
  category[0].children = children
   console.log(category[0])
  }

  if (category) {
    res.json({"status":"success","data":category})
  } else {
    res.status(404)
    throw new Error('category not found')
  }
})

const getCategoryName = asyncHandler(async (req, res) => {
  
  let category = req.params.category
  let subcategory = req.params.subcategory

  let data = [];

  let  cat = await CategoryModel.findById(category)
  let sub
  if(subcategory !== '00'){
    sub = await CategoryModel.findById(subcategory)
  }
  

  data = [...data, cat.name]
  if(subcategory !== '00'){
    data = [...data, sub.name]
  }
  

  res.json(data)

})


export {
  
  registerCategory,
  getCategoryAll,
  getCategoryById,
  deleteCategory,
  updateCategory,
  getCategoryName
}
