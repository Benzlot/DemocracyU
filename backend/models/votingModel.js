const mysql = require('mysql2');
const config = require('../config');

const pool = mysql.createPool(config.dbConfig).promise();

exports.getAllVotes = async () => {
  const [rows] = await pool.query('SELECT * FROM votes');
  return rows;
};

exports.castVote = async (userId, candidateId) => {
  await pool.query('INSERT INTO votes (user_id, candidate_id) VALUES (?, ?)', [userId, candidateId]);
};
