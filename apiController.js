const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("./models");
const User = db.User;
const Url = db.Url;
const router = express.Router();
const authenticateToken = require("./middleware")

// Đăng ký người dùng
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Thiếu thông tin!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
  } catch (error) {
    console.error("Lỗi khi tạo người dùng:", error);
    res.status(500).json({ message: "Lỗi khi tạo người dùng" });
  }
});

// Đăng nhập người dùng
router.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Thiếu thông tin!" });

    const user = await User.findOne({
      where: { username },
      attributes: ["userId", "username", "password", "role"], // ✅ Đảm bảo lấy `id`
    });

    if (!user)
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu!" });

    const token = jwt.sign(
      { userId: user.userId, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token, role: user.role });
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi khi đăng nhập!" });
  }
});

// Tạo URL rút gọn
router.post("/add", authenticateToken, async (req, res) => {
  try {
    const { short_code, target_url } = req.body;
    const domain = "move.8dslink.com"; // Tên miền cố định
    const userId = req.user.userId;
    console.log("👤 userId từ token:", userId); // Debug log

    if (!short_code || !target_url) {
      return res.status(400).json({ message: "Thiếu thông tin!" });
    }

    // Kiểm tra nếu short_code đã tồn tại
    const existingUrl = await Url.findOne({ where: { short_code } });
    if (existingUrl) {
      return res.status(400).json({ message: "Short code đã tồn tại!" });
    }

    await Url.create({
      short_code,
      target_url,
      userId,
    });

    res.status(201).json({
      message: "Tạo link thành công!",
      short_url: `${domain}/${short_code}`,
    });
  } catch (error) {
    console.error("❌ Lỗi khi tạo link rút gọn:", error);
    res.status(500).json({ message: "Lỗi server khi tạo link rút gọn" });
  }
});

// Lấy danh sách tất cả các link
router.get("/links", authenticateToken, async (req, res) => {
  try {
    console.log("🔥 API /api/links được gọi"); // Debug log
    const links = await Url.findAll({
      attributes: ["urlId", "short_code", "target_url", "userId"],
    });
    console.log(links.length);

    if (!links || links.length === 0) {
      console.log("❌ Không tìm thấy URL trong database");
      return res.status(404).json({ message: "Không tìm thấy URL" });
    }

    console.log("✅ Số lượng link lấy được:", links.length);
    res.json({ links });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách link:", error);
    res.status(500).json({
      message: "Lỗi server khi lấy danh sách link",
    });
  }
});

// Chuyển hướng URL
router.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;
    console.log(`🔥 Người dùng truy cập: ${shortCode}`);

    const url = await Url.findOne({
      where: { short_code: shortCode },
    });

    if (!url) {
      console.log("❌ Không tìm thấy URL");
      return res.status(404).json({ message: "Không tìm thấy URL" });
    }

    console.log(`🔗 Chuyển hướng tới: ${url.target_url}`);
    res.redirect(url.target_url);
  } catch (error) {
    console.error("❌ Lỗi khi chuyển hướng:", error);
    res.status(500).json({ message: "Lỗi server khi chuyển hướng" });
  }
});

module.exports = router;
