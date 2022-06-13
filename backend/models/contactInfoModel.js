import mongoose from 'mongoose'

const ContactInfoSchema =  mongoose.Schema({

         adminId:{
                 type: String,
                 required: true
         },
          street1: {
                    type: String,
                    required: true
          },
          street2: {
                    type: String
          },
          city: {
                    type: String,
                    required: true
          },
          state: {
                    type: String,
                    required: true
          },
          zip: {
                    type: String,
                    required: true
          },
          phone: {
                    type: String,
                    required: true
          },
          officialEmail: {
                    type: String,
                    required: true
          },
          supportEmail: {
                    type: String,
                    required: true
          }
})

let ContactInfo = mongoose.model('ContactInfo', ContactInfoSchema)

export default ContactInfo