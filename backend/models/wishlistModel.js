import mongoose from 'mongoose'

const wishlistModel = new mongoose.Schema({
          userId:{
                    type: String,
                    required: true,
          },
          productId:{
                    type: String,
                    required: true,
          },
          fromPrintful: {
                    type: Boolean,
                    required: true,
                    default: false
          }
          
},
{timestamps: true}
)

const wishlist = mongoose.model('wishlist', wishlistModel)

export default wishlist