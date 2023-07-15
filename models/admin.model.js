import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({

}, { timestamps: true })

const adminModel = mongoose.Model('admin', adminSchema);