require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./database");
const apiController = require("./apiController");
const app = express();
const PORT = process.env.PORT || 3000;
const authenticateToken = require("./middleware")
const FRONTEND_URL = process.env.REACT_APP_FRTEND_URL;

// Cấu hình CORS
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Định nghĩa JSON middleware TRƯỚC KHI gọi API Controller
app.use(express.json());

// Sử dụng các route từ apiController
app.use(
  "/",
  (req, res, next) => {
    console.log("📡 Một request tới API:", req.path);
    next();
  },
  apiController
);
// Kiểm tra token trước khi truy cập tất cả các route API
app.use(authenticateToken); // ✅ Middleware bảo vệ tất cả các API

// Đồng bộ database và chạy server
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Lỗi khi đồng bộ database:", err);
  });
