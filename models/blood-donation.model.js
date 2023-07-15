import mongoose from "mongoose";

const bloodDonationSchema = new mongoose.Schema({

}, { timestamps: true })

const bloodDonationModel = mongoose.Model('bloodDonation', bloodDonationSchema);