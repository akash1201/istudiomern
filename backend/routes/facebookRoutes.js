import express from 'express'
const router = express.Router()
import {
  facebookSignUp,
  facebookSignIn,
} from '../controllers/userController.js'

router.post('/signin', facebookSignIn)
router.post('/signup', facebookSignUp)

export default router