import mongoose from 'mongoose'

const orderSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    vendorId:{
      type: String,
      required: true,
      default: 'istudio'
    },
    productId: {
        type: String,
        required: true
    },
     variantId: {
        type: String,
        required: true
     },
     productName: {
       type: String,
       required: true
     },
     variantName: {
       type: String,
       required: true
     },
     productImage: {
       type: String, 
       required: true
     },
     url:{
       type: String,
       required: true,
       default: 'Normal Order' 
     },
     fromPrintful:{
       type: Boolean,
       required: true,
       default: false
     },
     price: {
       type: Number,
       required: true
     },
     coupons: [],
     priceAfterCoupon: {
       type: Number,
     },
     qty:{
       type: Number,
       required: true,
       default: 1
     },
    shippingAddress: {
      name: {type: String, required: true},
      email: {type: String, required: true},
      phone: {type: Number, required: true},
      address: { type: String, required: true },
      city: { type: String, required: true },
      state:{  type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    BillingAddress: {
      name: {type: String, required: true},
      email: {type: String, required: true},
      phone: {type: Number, required: true},
      address: { type: String, required: true },
      city: { type: String, required: true },
      state:{  type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      required: true
    },
    paymentStatus: {
      type: String,
      required: true,
      default: 'unpaid'
    },
    isCancel: {
      type: Boolean,
      required: true,
      default: false
    },
    shipping_id: {
      type: String,
    },
    shipping_transaction_id: {
      type: String,
    },
    card: {
      type: String,
      required: true
    },
    shippingCharge: {
      type: Number,
      default : 0
    },
    shipping_status: {
      type: String,
      required: true,
      default: 'Order Created'
    },
    printful_order_id: {
      type: String
    },
    reason:{
      type: String
    },
    comments: {
      type: String
    },
    isReturn: {
      type: Boolean,
      required: true,
      default: false
    },
  },
  {
    timestamps: true,
  }
)

const Order = mongoose.model('Order', orderSchema)

export default Order
