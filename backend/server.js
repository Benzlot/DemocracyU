// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { connectToDatabase, closeDatabaseConnection } = require('./Service/mongoDBService')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoute');
const adminRoutes = require('./routes/adminRoute');
const candidateRoutes = require('./routes/candidateRoutes');
const votingRoutes = require('./routes/votingRoutes');
const electionRoutes = require('./routes/electionRoutes')
const votersRoutes = require('./routes/voterRoutes')

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to ' + process.env.MONGODB_URI);
});
mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

app.use('/api/candidates', candidateRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/vote', votingRoutes);
app.use('/api/elections',electionRoutes)
app.use('/api/voters', votersRoutes)

app.use('/', (req, res)=>{
  console.log(req.body);
  res.send('Not found');
})

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});


app.on("error",(error)=>{
  console.log(error)
})

process.on('SIGINT', async () => {
  console.log('SIGINT received: closing database connection');
  await closeDatabaseConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received: closing database connection');
  await closeDatabaseConnection();
  process.exit(0);
});
