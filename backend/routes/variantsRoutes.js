import express from 'express'
const router = express.Router()
import {
 registervariants,
 updatevariants,
 deletevariants, 
 getvariants,
 getvariantsall
} from '../controllers/variantsController.js'

import {  protect } from '../middleware/authMiddleware.js'

router.post('/',registervariants)
router.get('/get',getvariants)
router.put('/update',updatevariants)
router.delete('/delete/:id',deletevariants)
router.get('/all', protect,getvariantsall)


  

export default router
