import mongoose from 'mongoose'

const cartSchema = mongoose.Schema({

  user: {
            type: String,
            required: true
  },
  product: {
            type: String,
            required: true
  },
  variantId: {
            type: String,
            required: true
  },
  fromPrintful: {
            type: Boolean,
            required: true,
            default: false
  },
  qty: {
            type: Number,
            required: true,
            default: 1
  }          

})

const Cart = mongoose.model('Cart', cartSchema)

export default Cart