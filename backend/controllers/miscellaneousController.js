import asyncHandler from 'express-async-handler'
import NewsLatter from "../models/newsLatterModel.js"
import ContactInfo from '../models/contactInfoModel.js'
import PlatformFees from '../models/platformFees.js'
import Notifications from "../models/Notifications.js"
import Countries from '../models/CountryModel.js'
import Stripe from 'stripe'
import Payment from '../models/paymentModel.js'
import Report from '../models/reportModel.js'
import Banners from '../models/bannerModel.js'

const stripe = new Stripe(process.env.STRIPE_SK)

const subscribe = asyncHandler(async(req, res)=>{

          const email = await NewsLatter.findOne({email: req.body.email })

          if(email){
             
                    res.json({
                              type: "error",
                              message: "Already Subscribed"
                    })

          }else{
               
                    const newEmail = await NewsLatter.create({email: req.body.email })
                    res.json({
                              type: "success",
                              message: "Subscribed"
                    })
          }
})

const contactInfo = asyncHandler(async(req, res)=>{

          const contact = await ContactInfo.findOne({adminId: req.body.adminId})

          if(!contact){
                  const newContact = await ContactInfo.create(req.body)
                  res.json(newContact)
          }else{
               contact.adminId = req.body.adminId
               contact.street1 = req.body.street1
               contact.street2 = req.body.street2?req.body.street2: contact.street2
               contact.city = req.body.city
               contact.state = req.body.state
               contact.zip = req.body.zip
               contact.phone = req.body.phone
               contact.officialEmail = req.body.officialEmail
               contact.supportEmail = req.body.supportEmail
               
             const newContact = await contact.save()

             res.json(newContact)
          }

})

const getContactInfo = asyncHandler(async(req, res)=>{
          const info = await ContactInfo.find({})

          res.json(info[0])
})

const getPlatformFee = asyncHandler( async(req, res)=>{

        const fee = await PlatformFees.find({})
        if(fee){
              res.json(fee[0])
        }else{
              res.status(400)
              throw new Error('No Record')
        }

})

const updatePlatformFee = asyncHandler(async(req, res)=>{
        let fee = null;
        console.log(req.body)
        try{
                fee = await PlatformFees.findById(req.body.id)
        }catch(err){
         console.log(err)
        }
       
        if(fee){
            let newFee = await PlatformFees.updateOne(
                {_id:req.body.id}, //query
                // $update query
                { $set : { amount: req.body.amount}})

                res.json({_id: req.body.id, amount: req.body.amount})
        }else{
                const newFee = await PlatformFees.create({
                        amount: req.body.amount
                })
                res.json(newFee)
        }
        

})

const getNotifications = asyncHandler( async(req, res)=>{

        let pageNo = req.query.pageNo? req.query.pageNo : 1
        let id = req.params.id
        let notifications = await Notifications.find({user: id}).sort({createdAt:-1}) .limit(pageNo*10) 
        let count = await Notifications.find({user: id, isRead: false}).countDocuments()    
        res.json({
                unread: count,
                notifications: notifications
        })

})

const deleteNotification = asyncHandler(async(req, res)=>{
   let id = req.params.id
   const noti = await Notifications.findById(id)
   if(noti){
     await noti.remove()
     res.json({message: 'removed'})
   }else{
           res.status(400)
           throw new Error('Not Found')
   }
})

const markAsRead = asyncHandler( async(req, res)=>{

        const noti = await Notifications.findById(req.params.id)
        if(noti){
               noti.isRead = true
               const newNoti =await noti.save() 
               console.log(newNoti)
               res.json(newNoti)               
        }else{
             res.status(400)
             throw new Error('Not Found')
        }
})

const listAllCountry = asyncHandler(async(req, res)=>{

        const stripe = new Stripe(process.env.STRIPE_SK)
        const countrySpec = await stripe.countrySpecs.retrieve(
                'US'
              )

              res.json(countrySpec)

})

const countryCodeList = asyncHandler(async(req, res)=>{

        const country = await Countries.find({})
        res.json(country)

})

const stripepayout = asyncHandler(async(req, res)=>{

        const fees = await PlatformFees.find({})
        const orders = await Payment.find({status: 'unpaid'})
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
                orders[i].status = 'paid'
                await orders[i].save()
              }catch(err){
                console.log("HERE")
                console.log(err)
              }
        
             }
            //  stripeCompanyAccountId
      
          
        }
      
      })

const getAllBanners = asyncHandler(async(req, res)=>{

        try{
           let banners = await Banners.find({});
           res.json({data : banners})
        }catch(err){
              res.status(400).json({data : []});
        }

})

export { getAllBanners,subscribe, contactInfo, getContactInfo, getPlatformFee, updatePlatformFee, getNotifications, deleteNotification, markAsRead, listAllCountry, countryCodeList, stripepayout }