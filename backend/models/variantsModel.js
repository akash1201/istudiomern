import mongoose from 'mongoose'

const variantsSchema = mongoose.Schema(
  { 
    variantsname: {
      type: String,
      required: true,
    },
  user:{
    type:String,
    required:true,
  },
  options:[
    {
     value: {
       type: String
     }
}]
,
categories : [],

  }
)

const Variants = mongoose.model('variantsSchema', variantsSchema)

export default Variants
