require("dotenv").config();
const { Sequelize } = require("sequelize");

// Kết nối với MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false, // Tắt log SQL để dễ đọc
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Kết nối database thành công!");
  } catch (error) {
    console.error("❌ Lỗi kết nối database:", error);
  }
})();

module.exports = sequelize;
