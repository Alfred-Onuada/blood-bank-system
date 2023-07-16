import mongoose from "mongoose";

const bloodDonationSchema = new mongoose.Schema({

}, { timestamps: true })

const bloodDonationModel = mongoose.model('bloodDonation', bloodDonationSchema);

export default bloodDonationModel;
