import { Router } from "express";
import handleError from "../utils/handleError.js";
import donorModel from "../models/donor.model.js";
import bloodDonationModel from "../models/blood-donation.model.js";
import hospitalModel from "../models/hospital.model.js";
import bloodRequestModel from "../models/blood-request.model.js";
import jwt from 'jsonwebtoken';
import messagesModel from "../models/messages.model.js";
const router = Router();

const getUser = function (req) {
  const token = req.cookies?.tk;

  let userEmail = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      userEmail = decoded.email;
    } catch (error) {
      // I don't want to do anything on error
    }
  }

  return userEmail;
}

router.get('/centers/:state', async (req, res) => {
  try {
    const { state } = req.params;

    const data = await hospitalModel.find({ state });

    if (data.length == 0) {
      res.status(404).json({ message: "No center found" })
      return;
    }

    res.status(200).json({ message: "Success", data })
  } catch (error) {
    handleError(error, res);
  }
})

router.post('/donate', async (req, res) => {
  try {
    const email = getUser(req);

    if (email == null) {
      res.status(401).json({ message: "Unauthorized request" })
      return;
    }

    const userInfo = await donorModel.findOne({ email });

    if (userInfo == null) {
      res.status(401).json({ message: "Unauthorized request" })
      return;
    }

    const info = req.body;
    info['donorId'] = userInfo._id;

    await bloodDonationModel.create(info);

    res.status(200).json({ message: "Blood donation request submitted successfully" })
  } catch (error) {
    handleError(error, res);
  }
});

router.post('/request', async (req, res) => {
  try {
    const email = getUser(req);

    if (email == null) {
      res.status(401).json({ message: "Unauthorized request" })
      return;
    }

    const userInfo = await hospitalModel.findOne({ email });

    if (userInfo == null) {
      res.status(401).json({ message: "Unauthorized request" })
      return;
    }

    const info = req.body;
    info['hospitalId'] = userInfo._id;

    await bloodRequestModel.create(info);

    res.status(200).json({ message: "Blood request submitted successfully" })
  } catch (error) {
    handleError(error, res);
  }
})

router.post('/contact', async (req, res) => {
  try {
    const info = req.body;

    await messagesModel.create(info);

    res.status(200).json({ message: "Message received" })
  } catch (error) {
    handleError(error, res);
  }
})

export default router;