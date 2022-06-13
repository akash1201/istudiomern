import mongoose from 'mongoose'

const promoCodeSchema = mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
   type: {
             type: String,
             required: true
   },
   value:{
             type: Number,
             required: true
   },
   hasMinPurchase: {
             type: Boolean,
             default: true
   },
   minAmount: {
             type: Number
   },
   expiryDate : {
                type: Date
   }
    
  },
  {
    timestamps: true,
  }
)

const PromoCodeModel = mongoose.model('PromoCodeModel', promoCodeSchema)

export default PromoCodeModel
