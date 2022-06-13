import mongoose from 'mongoose'

const newsLatterSchema = mongoose.Schema(
  {
    
    email: {
      type: String,
      required: true,
    }
    
  },
  {
    timestamps: true,
  }
)

const NewsLatter = mongoose.model('NewsLatter', newsLatterSchema)

export default NewsLatter
