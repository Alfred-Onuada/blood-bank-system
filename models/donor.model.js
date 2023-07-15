import mongoose from "mongoose";

const donorSchema = new mongoose.Schema({

}, { timestamps: true })

const donorModel = mongoose.Model('donor', donorSchema);