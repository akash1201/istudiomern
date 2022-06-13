import express from 'express'
import {addPromoCode,
       getPromoCode,
       deletePromoCode,
       editPromoCode,
       getPromocodeById,
       getAllPromoCode
        } from "../controllers/promocodeController.js"
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect,addPromoCode)
router.get('/all/:vendorId?',getAllPromoCode)
router.get('/:userid', protect,getPromoCode)
router.get('/promocode/:id', getPromocodeById)
router.put('/:id',protect, editPromoCode)
router.delete('/:id',protect,deletePromoCode)

export default router