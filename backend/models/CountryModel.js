import mongoose from 'mongoose'

const countrySchema = mongoose.Schema({

          name: {
                    type: String,
          },
          dial_code: {
                    type: String
          },
          code: {
                    type: String
          }

}) 

const Countries = mongoose.model('Countries', countrySchema)
export default Countries