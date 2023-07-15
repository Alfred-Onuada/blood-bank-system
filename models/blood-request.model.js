import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema({

}, { timestamps: true })

const bloodRequestModel = mongoose.Model('bloodRequest', bloodRequestSchema);