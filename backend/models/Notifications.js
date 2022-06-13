import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const NotificationsSchema = mongoose.Schema({

          image:{
                    type: String,
                    required: true,
                    default: `${process.env.BASE_URL}/assets/img/logo.png`
          },
          forAdmin:{
                    type: Boolean,
                    required: true,
                    default: false
          },
          user: {
           type: String
          },
          notification: {
                    type: String,
                    required: true
          },
          isRead: {
                    type: Boolean,
                    required: true,
                    default: false
          }
},{timestamps: true})

const Notifications = mongoose.model('Notifications', NotificationsSchema)
export default Notifications