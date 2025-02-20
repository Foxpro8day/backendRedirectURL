const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load biến môi trường

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Không có token!" });
  }

  const tokenParts = token.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(403).json({ message: "Token không hợp lệ!" });
  }

  jwt.verify(tokenParts[1], process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.log("❌ Token đã hết hạn");
        return res
          .status(401)
          .json({ message: "Token đã hết hạn, vui lòng đăng nhập lại!" });
      }
      console.log("❌ Token không hợp lệ");
      return res.status(403).json({ message: "Token không hợp lệ!" });
    }

    console.log("✅ Token hợp lệ, userId:", user.id);
    req.user = { userId: user.userId }; // ✅ Gán lại đúng userId
    next();
  });
};

module.exports = authenticateToken;
