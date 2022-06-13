import express from 'express'
const router = express.Router()
import {
          addToWishlist,
          removeFromWishlist,
          getAllWishlist,
          getProductIdFromWishlist
} from "../controllers/wishlistController.js"
import { protect } from '../middleware/authMiddleware.js'


router.post('/',protect,addToWishlist)
router.delete('/:id/:productId',protect,removeFromWishlist)
router.get('/:id', protect,getAllWishlist)
router.get('/products/:id',protect,getProductIdFromWishlist)

export default router