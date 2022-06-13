import mongoose from "mongoose"

const ReportSchema = mongoose.Schema({
     userId: {
               type: String,
               required: true
     },
     productId: {
          type: String,
          required: true
     },
     reason: {
               type: String,
               required: true
     },
     comments: {
               type: String
     }  
},
{timestamps: true})

const Report = mongoose.model('Report', ReportSchema)
export default Report