import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
const { isEmail, isMobilePhone } = validator;

const donorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please specify a Full Name"]
  },
  email: {
    type: String,
    required: [true, "Please specify an Email"],
    validate: [isEmail, "Please specify a valid email"],
    unique: true
  },
  phone: {
    type: String,
    required: [true, "Please specify a Phone Number"],
    validate: {
      validator: (phoneNumber) => isMobilePhone(phoneNumber, "en-NG"),
      message: "Please specify a valid Nigerian phone number (+234)",
    },
    unique: true
  },
  age: {
    type: Number,
    required: [true, "Please specify an Age"]
  },
  bloodGroup: {
    type: String,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: "Invalid blood group"
    },
    required: [true, "Please specify a blood group"]
  },
  genotype: {
    type: String,
    enum: {
      values: ['AA', 'AS', 'AC', 'SS', 'SC', 'CC'],
      message: "Invalid genotype"
    },
    required: [true, "Please specify a valid genotype"]
  },
  password: {
    type: String,
    required: [true, "Please specify a Password"],
    minLength: [8, "Password must be at least 8 characters long"],
    maxLength: [32, "Password must be less than 33 characters"]
  }
}, { timestamps: true })

donorSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  
  next()
})

const donorModel = mongoose.model('donor', donorSchema);

export default donorModel;