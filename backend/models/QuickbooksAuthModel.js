import mongoose from 'mongoose'

const QuickbooksAuthModel = new mongoose.Schema({

          environment: {
                     type: String,
                     required: true
          },

          clientId: {
                    type: String,
                    required: true
          },
          clientSecret:{
                    type: String,
                    required: true
          },
          redirectUri: {
                    type: String,
                    required: true
          },
          token:{
                    type: Object,
                    required: true
          },
          logging: {
                    type: Boolean,
          },
          logger: {
                    type: Object | String | Boolean
          },
          state: {
                    type: Object
          }
},
{timestamps: true}
)

const Quickbooks = mongoose.model('QuickbooksAuthModel', QuickbooksAuthModel)

export default Quickbooks