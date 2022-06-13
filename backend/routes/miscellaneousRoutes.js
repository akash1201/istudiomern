import express from 'express'
import {subscribe,contactInfo, getContactInfo, getPlatformFee, updatePlatformFee
,getNotifications,
markAsRead,
deleteNotification,
listAllCountry,
countryCodeList,
stripepayout,
getAllBanners
} from '../controllers/miscellaneousController.js'
import {protect} from "../middleware/authMiddleware.js"

const router = express.Router()

router.post('/subscribe', subscribe)
router.put('/contact-info', protect, contactInfo)
router.get('/contact-info', getContactInfo)
router.get('/platform-fee', protect,getPlatformFee)
router.put('/platform-fee', protect,updatePlatformFee)
router.get('/get-notifications/:id', protect, getNotifications)
router.put('/mark-as-read/:id', protect,markAsRead)
router.delete('/delete-notification/:id', protect, deleteNotification)
router.get('/list-all-country', listAllCountry)
router.get('/country-codes', countryCodeList)
router.post('/stripe-payout', stripepayout)

//banner management

router.get(`/get-all-banners`, getAllBanners);


export default router