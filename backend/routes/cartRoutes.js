import express from 'express'
import {addItemToCart, removeFromCart, updateCartItems, getCartItems, syncCart, clearCart} from '../controllers/cartController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/cart-items', protect, getCartItems)
router.post('/add-cart-items', protect, addItemToCart)
router.delete('/remove-from-cart/:variantId', protect, removeFromCart)
router.put('/update-cart/:variantId', protect, updateCartItems)
router.post('/sync-cart', protect, syncCart)
router.delete('/clear-cart', protect, clearCart)

export default router