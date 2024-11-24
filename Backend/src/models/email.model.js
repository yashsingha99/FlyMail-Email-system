const mongoose = require("mongoose")

const emailSchema = new mongoose.Schema({

   message: {
     type: String
   },
   subject: {
     type: String,
   },
   media: {
    type: String,
   },
   sender: {
     type : mongoose.Schema.Types.ObjectId,
     ref: 'User'
   },
   receiver: {
     type : mongoose.Schema.Types.ObjectId,
     ref: 'User'
   },
}, {  timestamps: true } )

const Email =  mongoose.model("Email", emailSchema);
module.exports = Email 
