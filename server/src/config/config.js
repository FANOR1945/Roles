const dotenv = require('dotenv');
dotenv.config();

const Port = process.env.Port;
const LOCALHOST = '127.0.0.1';

if (!Port) {
  throw new Error('PORT not found in environment variables');
}

module.exports = { Port, LOCALHOST };
