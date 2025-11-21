// backend/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Nếu có biến môi trường DB_URL (trên Render) thì dùng nó
// Nếu không (trên máy tính) thì dùng cấu hình cũ
const sequelize = process.env.DB_URL
    ? new Sequelize(process.env.DB_URL, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Bắt buộc cho Supabase/Render
            }
        }
      })
    : new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: 'postgres',
            logging: false,
        }
      );

module.exports = sequelize;