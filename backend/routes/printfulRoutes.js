import express from 'express'
const router = express.Router()
import {
          getProducts,
          getProductVariants,
          getRates,
          placeOrder,
          cancelOrder,
          updateOrderStatus
} from '../controllers/printfulController.js'

router.get('/getProducts/:pageNo', getProducts)
router.get('/getProductVariants/:id', getProductVariants)
router.post('/estimate-costs', getRates)
router.post('/place-order', placeOrder)
router.post('/update-order-status', updateOrderStatus)
router.delete('/cancel-order/:orderId', cancelOrder)



export default router