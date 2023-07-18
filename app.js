// Use custom env parser
import parser from './utils/env-parser.js'
parser();

import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cron from 'node-cron';
import appRoutes from './routes/general.routes.js'
import bloodDonationModel from './models/blood-donation.model.js';
import donorModel from './models/donor.model.js';
import { sendEmail } from './routes/admin.routes.js';

const DB_URI = process.env.NODE_ENV === 'development' ? process.env.DB_URI_DEV : process.env.DB_URI_PROD;
const PORT = process.env.PORT || 9111;

// Create server instance
const server = express();
server.set('view engine', 'ejs');
server.use(express.static('./public'))
server.use(cookieParser());
server.use(express.json());

// connect to DB
await mongoose.connect(DB_URI);

server.use('/', appRoutes);

server.use('**', (req, res) => {
  // TODO: use a 404 animation page
  res.status(404).json({ message: "Page not found" })
})

// setup cron job to send emails for appointments every day at 12am
cron.schedule('0 0 * * *', async () => {
  // get all the donations and figure out which is for today
  const today = new Date();

  // Step 2: Set the time to 12:00 AM (midnight)
  today.setUTCHours(0, 0, 0, 0);

  // Step 3: Format the date to the ISO date string format
  const formattedDate = today.toISOString();
  
  const donations = await bloodDonationModel.find({ date: formattedDate });

  donations.forEach(async (donation) => {
    const donor = await donorModel.findOne({ _id: donation.donorId });

    sendEmail(donor.email, "Hi, I am here to remind you of your appointment to donate blood today");
  })
})

server.listen(PORT);
console.log(`App is live at port ${PORT}`)