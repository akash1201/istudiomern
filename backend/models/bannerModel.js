import mongoose from 'mongoose'

const bannerSchema = mongoose.Schema({

          type: {
                    type: String,
                    default : 'main-banner'
          },
          image: {
                    type: String,
                    required: true
          },
          heading: {
                    type: String,
                    required: true
          },
          tagline: {
                    type: String,
                    required: true
          },
          product: {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : 'Product'

          }

}) 

const Banners = mongoose.model('Banners', bannerSchema)
export default Banners;