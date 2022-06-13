import express from 'express'
const router = express.Router()
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getProductVariant,
  updateAvailableOptions,
  getFeaturedProducts,
  updateActive,
  getProductsAll,
  getCategoryProducts,
  reportProduct,
  getProductAndCategory
} from '../controllers/productController.js'
import { protect, admin ,vendor} from '../middleware/authMiddleware.js'

router.route('/').get(getProducts).post(protect, createProduct)
router.route('/category/:categoryId').get(getCategoryProducts)
router.route('/:id/reviews').post(protect, createProductReview)
router.get('/top', getTopProducts)
router.get('/variants/:id', getProductVariant)
router.put('/updateAvailableOptions/:id', updateAvailableOptions)
router.put('/updateActive/:id', updateActive)
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, deleteProduct)
  .put(protect, updateProduct)

  router
  .route('/report')
  .post(protect, reportProduct)



router.route('/vendor').get(getProducts).post(protect, vendor, createProduct)
router.route('/vendor/:id/reviews').post(protect,vendor , createProductReview)
router.get('/vendor/top/:categoryId', getTopProducts)
router.get('/vendor/all/:id', getProductsAll)
router.get('/vendor/featured/:categoryId', getFeaturedProducts)
router
  .route('/vendor/:id')
  .get(getProductById)
  .delete(protect, vendor, deleteProduct)
  .put(protect, vendor, updateProduct)
router.route('/vendor-get-products-category/:vendorId').get(getProductAndCategory)


export default router
