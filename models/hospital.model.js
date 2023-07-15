import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({

}, { timestamps: true })

const hospitalModel = mongoose.Model('hospital', hospitalSchema);