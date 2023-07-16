import { Router, request } from "express";
import handleError from "../utils/handleError.js";
import donorModel from "./../models/donor.model.js"
import hospitalModel from "./../models/hospital.model.js"
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
const router = Router();

/**
 * This creates and assigns the token to the user's cookie
 * @param {String} email 
 * @param {"donor"|"hospital"} userType 
 * @param {request} res 
 */
const createJWT = function (email, userType, res) {
  const payload = {
    email,
    userType
  }

  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' })

  res.cookie('tk', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV == 'production' ? true : false,
    sameSite: 'strict',
    maxAge: 604800000
  });
}

router.post('/register/:userType', async (req, res) => {
  try {
    const info = req.body;
    const userType = req.params.userType;

    if (userType == 'donor') {
      await donorModel.create(info);
    } else {
      await hospitalModel.create(info);
    }

    createJWT(info.email, userType, res);

    res.status(200).json({ message: "Registration Successful" });
  } catch (error) {
    handleError(error, res);
  }
})

router.post('/login/:userType', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userType = req.params.userType;

    let userInfo = null;
    if (userType == 'donor') {
      userInfo = await donorModel.findOne({ email: email });
    } else {
      userInfo = await hospitalModel.findOne({ email: email });
    }

    if (userInfo == null) {
      res.status(401).json({ message: "Invalid Credentials" });
      return;
    }

    if (!bcrypt.compareSync(password, userInfo.password)) {
      res.status(401).json({ message: "Invalid Credentials" });
      return;
    }

    createJWT(email, userType, res);

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    handleError(error, res);
  }
})

export default router;