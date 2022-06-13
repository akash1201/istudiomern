import asyncHandler from 'express-async-handler'
import PromoCodeModel from "../models/promoCodeModel.js"
import User from '../models/userModel.js'

//Post 
const addPromoCode = asyncHandler(async (req, res)=>{

          const {code, userid} = req.body
          console.log(req.body)

          const exists = await PromoCodeModel.findOne({userid: userid,code: code})

          if(exists) {
                    res.status(400)
                    throw new Error('Promo Code Exists')
          }
         
          const promo = await PromoCodeModel.create(req.body)

          if(promo){
 
                    res.json(promo)

          }else{
                    res.status(400)
                    throw new Error('Invalid Data')
          }

})

//Get
const getPromoCode = asyncHandler(async (req, res)=>{

          const userid = req.params.userid
          
          const promo = await PromoCodeModel.find({userid: userid})

          res.json(promo)
})

const comparePromo = (data) => {
  let expiry = new Date(data.expiryDate);
  let today = new Date()
  today.setHours(0,0,0,0)
  expiry.setHours(0,0,0,0)

  if(expiry>=today){
    return true
  }else{
    return false
  }
  
}

const getAllPromoCode = asyncHandler(async (req, res) => {
  
  if(req.params.vendorId == 'admin'){
      let data1 = []
      const users = await User.find({userType: 'admin'})
      for(let i=0; i<users.length; ++i){
        const promo = await PromoCodeModel.find({userid: users[i]._id})
        data1 = [...data, ...promo]
      }
      let data = []
      for(let i=0; i<data1.length; ++i){
        if(data1[i].expiryDate){
        let response = comparePromo(data1[i])
        if(response){
          data = [...data, data1[i]]
        }
        }else{
          data = [...data, data1[i]]
        }
     }
     res.json(data)
  }else{
    let data = []
    const promo = await PromoCodeModel.find({userid: req.params.vendorId})
    for(let i=0; i<promo.length; ++i){
       if(promo[i].expiryDate){
       let response = comparePromo(promo[i])
       if(response){
         data = [...data, promo[i]]
       }
       }else{
         data = [...data, promo[i]]
       }
    }
    res.json(data)
  }
  
})

const getPromocodeById = asyncHandler(async (req, res)=>{

          const id = req.params.id
            console.log(id)
          const promo = await PromoCodeModel.findOne({code: id})

          res.json(promo)
})

//Put
const editPromoCode = asyncHandler(async (req, res)=>{

          const id = req.params.id

          let promo = await PromoCodeModel.findById(id)

          promo.code = req.body.code
          promo.type = req.body.type
          promo.value = req.body.value
          promo.hasMinPurchase = req.body.hasMinPurchase
          promo.minAmount = req.body.minAmount
          promo.expiryDate = req.body.expiryDate

          const newpromo = await promo.save()
          res.json(newpromo)
})

//Delete

const deletePromoCode = asyncHandler(async (req, res)=>{

          const id = req.params.id

          const promo = await PromoCodeModel.findById(id)

          if(promo){

                    await promo.remove()
                    res.json({
                              message: "Removed"
                    })

          }else{
          res.status(404)
          throw new Error('category not found')     
          }

})

export {
          addPromoCode,
          getPromoCode,
          editPromoCode,
          deletePromoCode,
          getPromocodeById,
          getAllPromoCode
}