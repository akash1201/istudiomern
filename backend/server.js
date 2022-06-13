import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import cors from "cors"

import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes  from './routes/uploadRoutes.js'
import variantsRoutes from './routes/variantsRoutes.js'
import wishlistRoutes from './routes/wishlistRoutes.js'
import promoRoutes from './routes/promoRoutes.js'
import shippoRoutes from './routes/shippoRoutes.js'
import facebookRoutes from "./routes/facebookRoutes.js"
import googleRoutes from "./routes/googleRoutes.js"
import quickbooksRoutes from "./routes/quickBooksRoutes.js"
import printfulRoutes from './routes/printfulRoutes.js'
import miscellaneousRoutes from './routes/miscellaneousRoutes.js'
import cartRoutes from "./routes/cartRoutes.js"
// import optionsRoutes from './routes/optionsRoutes.js'


dotenv.config()

connectDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(cors())

app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/category',categoryRoutes)
app.use('/api/upload',uploadRoutes)
app.use('/api/variants',variantsRoutes)
app.use('/api/wishlist',wishlistRoutes)
app.use('/api/promo',promoRoutes)
app.use('/api/shippo',shippoRoutes)
app.use('/api/google', googleRoutes)
app.use('/api/facebook',facebookRoutes)
app.use('/api/quickbooks',quickbooksRoutes)
app.use('/api/printful',printfulRoutes)
app.use('/api/miscellaneous', miscellaneousRoutes)
// app.use('/api/quickbooks',quickbooksRoutes)
// app.use('/api/variants/options',optionsRoutes)


app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
