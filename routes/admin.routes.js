import { Router } from "express";
import { createJWT } from "./auth.routes.js";
import jwt from 'jsonwebtoken';
import bloodRequestModel from "../models/blood-request.model.js";
import bloodDonationModel from "../models/blood-donation.model.js";
import handleError from "../utils/handleError.js";
import hospitalModel from "../models/hospital.model.js";
import donorModel from "../models/donor.model.js";
const router = Router();

const getNetBloodQuantity = async function () {
  // run an aggregation to get all the required info
  // group by blood type and add all approved blood also group by blood type and subtract all approve requsrt for blood
  const bloodQuantityDonated = await bloodDonationModel.aggregate([
    {
      $lookup:
        {
          from: "donors",
          localField: "donorId",
          foreignField: "_id",
          as: "donor",
        },
    },
    {
      $addFields:
        {
          donor: {
            $first: "$donor",
          },
        },
    },
    {
      $match: {
        approved: 'yes'
      }
    },
    {
      $group: {
        _id: "$donor.bloodGroup",
        total: { $sum: "$quantity" }
      }
    }
  ]);

  const bloodQuantityRequested = await bloodRequestModel.aggregate([
    {
      $match: {
        approved: 'yes'
      }
    },
    {
      $group: {
        _id: "$bloodGroup",
        total: { $sum: "$quantity" }
      }
    }
  ]);

  const donatedMap = new Map();
  bloodQuantityDonated.forEach(({ _id, total }) => {
    donatedMap.set(_id, total);
  });

  const requestedMap = new Map();
  bloodQuantityRequested.forEach(({ _id, total }) => {
    requestedMap.set(_id, total);
  });

  // Calculate the net quantity and assign 0 to blood groups that haven't been donated yet
  const combined = {};

  Array.from(donatedMap.keys()).forEach(group => {
    combined[group] = donatedMap.get(group) - (requestedMap.get(group) || 0)
  })

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  bloodGroups.forEach(group => {
    if (combined.hasOwnProperty(group) == false) {
      combined[group] = 0
    }
  })

  return combined;
}

router.get('/', (req, res) => {
  res.render('admin/home')
})

router.get('/requests', async (req, res) => {
  const token = req.cookies?.tk;

  if (token) {
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      res.redirect('/');
    }
  }

  const combined = await getNetBloodQuantity();

  const donationRequest = await bloodDonationModel.aggregate([
    {
      $match: {
        approved: 'not reviewed',
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
    {
      $lookup:
        {
          from: "donors",
          localField: "donorId",
          foreignField: "_id",
          as: "donor",
        },
    },
    {
      $addFields:
        {
          donor: {
            $first: "$donor",
          },
        },
    },
    {
      $addFields:
        {
          fullName: "$donor.fullName",
          bloodGroup: "$donor.bloodGroup",
          genotype: "$donor.genotype",
        },
    },
    {
      $project:
        {
          donor: 0,
        },
    },
  ]);

  const bloodRequest = await bloodRequestModel.aggregate([
    {
      $match: {
        approved: 'not reviewed',
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
    {
      $lookup: {
        from: "hospitals",
        localField: "hospitalId",
        foreignField: "_id",
        as: "hospital",
      },
    },
    {
      $addFields: {
        hospital: {
          $first: "$hospital",
        },
      },
    },
    {
      $addFields: {
        hospitalName: "$hospital.hospitalName",
      },
    },
    {
      $project: {
        hospital: 0,
      },
    },
  ]);

  const hospitals = await hospitalModel.find({});

  const donors = await donorModel.find({});

  console.log(hospitals)
  console.log(donors)

  res.render('admin/requests', { donationRequest, bloodRequest, combined, hospitals, donors });
})

router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== process.env.ADMIN_EMAIL && password !== process.env.ADMIN_PASSWORD) {
      res.status(401).json({ message: "Inavlid Credentials" })
      return;
    }

    createJWT(email, 'admin', res);

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    handleError(error, res);
  }
})

router.patch('/rejectRequest/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (typeof id == 'undefined') {
      res.status(400).json({ message: "Invalid request ID" });
      return;
    }

    // This is a string false
    const updateInfo = await bloodRequestModel.updateOne({ _id: id }, { approved: 'no' });

    if (updateInfo.matchedCount == 0) {
      res.status(404).json({ message: "Operation failed, No such blood request" })
      return;
    }

    res.status(200).json({ message: "success" });
  } catch (error) {
    handleError(error, res);
  }
})

router.patch('/approveRequest/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (typeof id == 'undefined') {
      res.status(400).json({ message: "Invalid request ID" });
      return;
    }

    // Calculate how much blood for that group is available
    const combined = await getNetBloodQuantity();
    const bloodRequest = await bloodRequestModel.findOne({ _id: id });
    
    if (bloodRequest == null) {
      res.status(404).json({ message: "Operation failed, No such blood request" })
      return;
    }

    if (bloodRequest.quantity > combined[bloodRequest.bloodGroup]) {
      res.status(400).json({ message: "Operation failed, Not enough blood of that type" })
      return;
    }

    await bloodRequestModel.updateOne({ _id: id }, { approved: 'yes' });

    res.status(200).json({ message: "success" });
  } catch (error) {
    handleError(error, res);
  }
})

router.patch('/rejectDonation/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (typeof id == 'undefined') {
      res.status(400).json({ message: "Invalid donation ID" });
      return;
    }

    // This is a string false
    const updateInfo = await bloodDonationModel.updateOne({ _id: id }, { approved: 'no' });

    if (updateInfo.matchedCount == 0) {
      res.status(404).json({ message: "Operation failed, No such blood donation" })
      return;
    }

    res.status(200).json({ message: "success" });
  } catch (error) {
    handleError(error, res);
  }
})

router.patch('/approveDonation/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (typeof id == 'undefined') {
      res.status(400).json({ message: "Invalid donation ID" });
      return;
    }

    // This is a string false
    const updateInfo = await bloodDonationModel.updateOne({ _id: id }, { approved: 'yes' });

    if (updateInfo.matchedCount == 0) {
      res.status(404).json({ message: "Operation failed, No such blood donation" })
      return;
    }

    res.status(200).json({ message: "success" });
  } catch (error) {
    handleError(error, res);
  }
})

export default router;