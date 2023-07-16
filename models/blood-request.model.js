import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema({

}, { timestamps: true })

const bloodRequestModel = mongoose.model('bloodRequest', bloodRequestSchema);

export default bloodRequestModel;
