const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const votingRoutes = require('./routes/votingRoutes');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/vote', votingRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
