 import express from 'express'

import {
    registerCategory,
    getCategoryAll,
    getCategoryById,
    deleteCategory,
    updateCategory,
    getCategoryName
} from '../controllers/categoryController.js'
import { protect,admin } from '../middleware/authMiddleware.js';


const router = express.Router();
router.post("/add",registerCategory);
router.get("/getall",getCategoryAll);
router.delete("/delete/:id", protect,deleteCategory);
router.put("/update",protect, updateCategory);
router.get("/get",protect, getCategoryById);
router.get("/name/:category/:subcategory", getCategoryName)



export default router
