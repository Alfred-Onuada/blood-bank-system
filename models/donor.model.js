import mongoose from "mongoose";
import bcrypt from "bcrypt";

const donorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please specify a Full Name"]
  },
  email: {
    type: String,
    required: [true, "Please specify an Email"],
    unique: true
  },
  phone: {
    type: String,
    required: [true, "Please specify a Phone Number"],
    unique: true
  },
  age: {
    type: Number,
    required: [true, "Please specify an Age"]
  },
  bloodGroup: {
    type: String,
    required: [true, "Please specify a Blood Group"]
  },
  genotype: {
    type: String,
    required: [true, "Please specify a Genotype"]
  },
  password: {
    type: String,
    required: [true, "Please specify a Password"]
  }
}, { timestamps: true })

donorSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  
  next()
})

const donorModel = mongoose.Model('donor', donorSchema);