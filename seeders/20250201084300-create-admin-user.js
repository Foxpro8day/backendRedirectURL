const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    return queryInterface.bulkInsert("Users", [
      {
        userId: 1,
        username: "admin",
        password: hashedPassword,
        role:"admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        username: "user1",
        password: await bcrypt.hash("userpass", 10),
        role:"client",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
