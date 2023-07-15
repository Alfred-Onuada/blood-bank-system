import mongoose from "mongoose";
import bcrypt from "bcrypt";

const hospitalSchema = new mongoose.Schema({
  hospitalName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true })

hospitalSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  
  next();
});

const hospitalModel = mongoose.Model('hospital', hospitalSchema);