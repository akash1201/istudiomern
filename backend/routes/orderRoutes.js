import express from 'express'
const router = express.Router()
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getOrdersById,
  vendorGetOrdersById,
  cancelOrders,
  cancelledOrders,
  getDeliveredOrders,
  getAllOrdersById,
  vendorGetCancelledOrdersById,
  approveReturnOrder,
  requestReturnOrder
} from '../controllers/orderController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/:pageNo?').post(addOrderItems).get(protect, getOrders)
router.route('/myorders').get(protect, getMyOrders)
router.route('/cancel/:orderId').put(protect, cancelOrders)
router.route('/:id').get(protect, getOrderById)
router.route('/cancelled/:id/:pageNo?').get(protect, cancelledOrders)
router.route('/getOrdersById/:id/:pageNo?').get(protect, getOrdersById)
router.route('/getAllOrdersById/:id/:pageNo?').get(protect, getAllOrdersById)
router.route('/getDeliveredOrders/:id/:pageNo?').get(protect, getDeliveredOrders)
router.route('/vendorGetOrdersById/:id/:pageNo?').get(protect, vendorGetOrdersById)
router.route('/vendorGetCancelledOrdersById/:id/:pageNo?').get(protect, vendorGetCancelledOrdersById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)
router.route('/requestReturn/:id').put(protect, requestReturnOrder)
router.route('/approveReturn/:id').put(protect, approveReturnOrder)

export default router
