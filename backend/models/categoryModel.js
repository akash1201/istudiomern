import mongoose from 'mongoose'

const categorySchema = mongoose.Schema(
  {
    
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      default:'/assets/img/logo.png'
    },
    active: {
      type: Boolean,
      required: true,
    },
    slug:{
      type:String
    },
    parentid:{
      type:String,
      default: "parent"
    },
    children:[{
      type:Object
    }]
    
  },
  {
    timestamps: true,
  }
)

const CategoryModel = mongoose.model('CategoryModel', categorySchema)

export default CategoryModel
