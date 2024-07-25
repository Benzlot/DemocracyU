const mongoose = require('mongoose');

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  console.log('Creating new database connection');
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: "DemocracyU",
  });
  isConnected = true;

  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to ' + process.env.MONGODB_URI);
  });
  mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error: ' + err);
  });
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
    isConnected = false;
  });
};

const closeDatabaseConnection = async () => {
  if (isConnected) {
    await mongoose.connection.close();
    console.log('Mongoose connection closed');
    isConnected = false;
  }
};

module.exports = { connectToDatabase, closeDatabaseConnection };
