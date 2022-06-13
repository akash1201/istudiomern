import express from 'express'
const router = express.Router()
import {
          googleSignUp,
          googleSignIn,
        } from '../controllers/userController.js'

router.post('/signin',googleSignIn)
router.post('/signup',googleSignUp)

export default router