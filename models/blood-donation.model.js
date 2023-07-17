import mongoose from "mongoose";

const bloodDonationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'donor',
    required: [true, 'Donor ID is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  state: {
    type: String,
    required: [true, 'State is required']
  },
  center: {
    type: String,
    required: [true, 'Center is required']
  },
  approved: {
    type: String,
    enum: {
      values: ['yes', 'no', 'not reviewed'],
    },
    default: 'not reviewed'
  }
}, { timestamps: true })

const bloodDonationModel = mongoose.model('bloodDonation', bloodDonationSchema);

export default bloodDonationModel;


// TODO: might use mongoDB trigger
