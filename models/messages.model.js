import mongoose from "mongoose";
import validator from "validator";
const { isEmail, isMobilePhone } = validator;

const messagesSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please specify an Email"],
    validate: [isEmail, "Please specify a valid email"],
  },
  phone: {
    type: String,
    required: [true, "Please specify a Phone Number"],
    validate: {
      validator: (phoneNumber) => isMobilePhone(phoneNumber, "en-NG"),
      message: "Please specify a valid Nigerian phone number (+234)",
    },
  },
  message: {
    type: String,
    required: [true, "Please specify a message"]
  }
}, { timestamps: true })

const messagesModel = mongoose.model('message', messagesSchema);

export default messagesModel;