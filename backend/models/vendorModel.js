import mongoose from 'mongoose'

const vendorModel = mongoose.Schema(
    {
        storename:{
            type:String
        },
        image:{
            type:String
        },
        phone:{
            type:String
        },
        companyname:{
            type:String
        }
},{
timestamps:true,
}
)

const Vendor = mongoose.model('vendorModel',vendorModel)

export default Vendor