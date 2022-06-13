import asyncHandler from 'express-async-handler'
import Options from '../models/optionsModel.js'
import express from 'express'


const app = express()
// @route   POST /api/Options/add
const registeroptions = asyncHandler(async (req,res) => {
  const {variantsid} = req.body;
  console.log(req.body)


//   //same as other product api
//   const optionsExists = await Options.findOne({ variantsid })//

//   if (optionsExists) {
//     res.status(400)
//     throw new Error('Options already exists')
//   }

  const options = await Options.create(req.body)

  if (options) {
    res.status(201).json({
    options
     })
  } else {
    res.status(400)
    throw new Error('Invalid Options data')
  }


})

const getOptionsall = asyncHandler(async(req,res)=>{
    const {variantsid} = req.body;
    const options  = await Options.find({"variantsid":variantsid});

    // console.log(Options)
    if(options){
        res.status(201).json({options});

    }else{
        res.status(400).json({"message":"invalid json data"});
      
    }


})

// @route   PUT /api/Options/profile
const updateOptions = asyncHandler(async (req, res) => {
  console.log(req.body)
  const options = await Options.findById(req.body.id)
 console.log(options)
  if (options) {
    options.userid = req.body.userid || options.userid
    options.variantsid = req.body.variantsid || options.variantsid
    options.variantsvalue = req.body.variantsvalue || options.variantsvalue
    options.icon = req.body.icon || options.icon
    options.description = req.body.description || options.description

   

    const updatedOptions = await options.save()


    res.json({
      msg :"updated successfully",
      options
     })
  } else {
    res.status(404)
    throw new Error('Options not updated')
  }
})

// @route   DELETE /api/Optionss/:id
const deleteOptions = asyncHandler(async (req, res) => {
  console.log(req.body);
  console.log(req.body)
  const options = await Options.find({"userid":req.body.userid})

  if (options) {
    await Options.remove()
    res.json({ message: 'Options removed' })
  } else {
    res.status(404)
    throw new Error('Options not found')
  }
})


// @route   DELETE /api/Optionss/:id
const deleteOneOptions = asyncHandler(async (req, res) => {
    console.log(req.body);
    const options = await Options.findById({"_id":req.body.id})
  
    if (options) {
      await options.remove()
      res.json({ message: 'Options removed' })
    } else {
      res.status(404)
      throw new Error('Options not found')
    }
  })
  
  


export {
  
  registeroptions,
  getOptionsall,
  deleteOptions,
  updateOptions,
  deleteOneOptions

}
