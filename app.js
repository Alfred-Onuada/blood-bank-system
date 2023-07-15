// Use custom env parser
import parser from './utils/env-parser.js'
parser();

import express from 'express';
import mongoose from 'mongoose';
import appRoutes from './routes/general.routes.js'

const DB_URI = process.env.NODE_ENV === 'development' ? process.env.DB_URI_DEV : process.env.DB_URI_PROD;
const PORT = process.env.PORT || 9111;

// Create server instance
const server = express();
server.set('view engine', 'ejs');
server.use(express.static('./public'))

// connect to DB
await mongoose.connect(DB_URI);

server.use('/', appRoutes);

server.use('**', (req, res) => {
  // TODO: use a 404 animation page
  res.status(404).json({ message: "Page not found" })
})

server.listen(PORT);
console.log(`App is live at port ${PORT}`)