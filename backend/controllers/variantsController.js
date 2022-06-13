import asyncHandler from 'express-async-handler'
import Variants from '../models/variantsModel.js'
import express from 'express'
import jwt from 'jsonwebtoken'


const app = express()
// @route   POST /api/variants/add
const registervariants = asyncHandler(async (req,res) => {
  const {variantsname,user,options} = req.body;


  //same as other product api
  const variantsExists = await Variants.findOne({ variantsname })//

  // if (variantsExists) {
  //   res.status(400)
  //   throw new Error('variants already exists')
  // }

  const variants = await Variants.create(req.body)
  console.log(variants)
  
  // const options1 = await Options.create(req.body.options)


  if (variants) {
    res.status(201).json({"status":"success",
    "data":variants,
    // "options":options1
     })
  } else {
    res.status(400)
    throw new Error('Invalid variants data')
  }


})


const getvariantsall = asyncHandler(async(req,res)=>{

  let token = req.headers.authorization.split(' ')[1]
  let userid = jwt.verify(token, process.env.JWT_SECRET)

  const variants = await Variants.find({user: userid.id});
  if(variants){
    res.status(201).json({"status":"success","data":variants})
  }else{
    res.status(400).json({"msg":"data not present"})
  }
})

const getvariants = asyncHandler(async(req,res)=>{
    console.log(req.body)
    const {id} = req.body;
    const variants  = await Variants.findById(id);
  
    // const variants  = await Variants.find({"variantsname":variant_name});
  
    // var object ={};
    // object.variants = variants[0]
    // object.options = options
    // console.log(variants)
    if(variants){
        res.status(201).json({"status":"success","data":variants});

    }else{
        res.status(400).json({"message":"invalid json data"});
      
    }


})

// @route   PUT /api/variants/profile
const updatevariants = asyncHandler(async (req, res) => {
  console.log(req.body.options)
  const body = req.body.options;
  const variants = await Variants.findById(req.body.id)
//  console.log(variants)
  if (variants) {
    variants.variantsname = req.body.variantsname || variants.variantsname;
    variants.user = req.body.user || variants.user ;
    variants.options = req.body.options || variants.options
    variants.categories = req.body.categories || variants.categories
  

    const updatedvariants = await variants.save()


    res.json({
      "status" :"updated successfully",
      _id: updatedvariants._id,
      variantsname: updatedvariants.variantsname,
     })
  } else {
    res.status(404)
    throw new Error('variants not updated')
  }
})

// @route   DELETE /api/Variantss/:id
const deletevariants = asyncHandler(async (req, res) => {
  console.log(req.body);
  const id = req.params.id;
  const variants = await Variants.findById(id)
 
  if (variants) {
    await variants.remove()
    res.json({"status":"success", message: 'variants removed' })
  } else {
    res.status(404)
    throw new Error('variants not found')
  }
})


export {
  
  registervariants,
  getvariants,
  deletevariants,
  updatevariants,
  getvariantsall

}
