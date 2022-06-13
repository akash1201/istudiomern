import express from 'express'
import {
          getRates,
          shippoWebhook,
          getReturnRates
} from '../controllers/shippoController.js'
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post("/getRates/:id/:productId/:qty",getRates);
router.post('/shippo-update-package-status', shippoWebhook)
router.get('/get-return-rates/:orderId', getReturnRates)



export default router
