const { Sequelize } = require('sequelize');
const path = require('path');

// We are using SQLite for ease of setup as agreed.
// It stores data in a local file so no separate MySQL server is needed.
// To switch to MySQL, uncomment the MySQL section and comment the SQLite one.

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'ecommerce.sqlite'),
  logging: false, // Set to console.log to see SQL queries
});

/* 
// For MySQL:
const sequelize = new Sequelize('ecommerce_db', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});
*/

module.exports = sequelize;
