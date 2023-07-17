import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'hospital',
    required: [true, "Please specify a valid hospital ID"]
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
  quantity: {
    type: Number,
    required: [true, "Please specify the quantity"]
  },
  approved: {
    type: String,
    enum: {
      values: ['yes', 'no', 'not reviewed'],
    },
    default: 'not reviewed'
  }
}, { timestamps: true })

const bloodRequestModel = mongoose.model('bloodRequest', bloodRequestSchema);

export default bloodRequestModel;
