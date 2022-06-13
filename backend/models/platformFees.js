import mongoose from "mongoose"

const PlatformFeesSchema = mongoose.Schema({
          amount: {
                    type: Number,
                    required: true
          }
},
{timestamps: true})

const PlatformFees = mongoose.model('PlatformFees', PlatformFeesSchema)
export default PlatformFees