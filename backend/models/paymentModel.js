import mongoose from 'mongoose'

const paymentSchema = mongoose.Schema({
          vendor: {
                    type: String,
                    required: true
          },
          amount: {
                    type: Number,
                    required: true
          },
          shipping: {
                    type: Number,
                    required: true
          },
          orderId: {
                type: String
          },
          discount: {
                    type: Number,
                    required: true
          },
          status: {
                    type: String,
                    required: true,
                    default: 'unpaid'
          },
          promoCode:{
                    type: String
          },
          stripeChargeId: {
                    type: String
          },
          payout_id: {
                    type: String
          },
          amount_paid: {
                    type: Number
          }
},
{timestamps: true}
)
const Payment = mongoose.model('Payment', paymentSchema)
export default Payment