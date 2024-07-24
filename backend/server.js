// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
