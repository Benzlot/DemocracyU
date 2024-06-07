const mysql = require('mysql2');
const config = require('../config');

const pool = mysql.createPool(config.dbConfig).promise();

exports.getUserById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};
