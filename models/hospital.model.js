import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
const { isEmail } = validator;

const hospitalSchema = new mongoose.Schema({
  hospitalName: {
    type: String,
    required: [true, "Please enter a hospital name"]
  },
  email: {
    type: String,
    required: true,
    validate: [isEmail, "Please specify a valid email"],
    unique: true
  },
  address: {
    type: String,
    required: [true, "Please enter an address"]
  },
  state: {
    type: String,
    required: [true, "Please enter a state"]
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minLength: [8, "Password must be at least 8 characters long"],
    maxLength: [32, "Password must be less than 33 characters"],
  }
}, { timestamps: true })

hospitalSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  
  next();
});

const hospitalModel = mongoose.model('hospital', hospitalSchema);

export default hospitalModel;