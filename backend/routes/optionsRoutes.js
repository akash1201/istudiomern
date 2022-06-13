import express from 'express'
const router = express.Router()
import {
 deleteOptions,
 getOptionsall,
 registeroptions, 
 updateOptions,
 deleteOneOptions
} from '../controllers/optionsController.js'

import {  admin } from '../middleware/authMiddleware.js'

router.get('/get',getOptionsall)
router.post('/add',registeroptions)
router.put('/update',updateOptions)
router.delete('/delete',deleteOneOptions)
router.delete('/deleteall',deleteOptions)

  

export default router
