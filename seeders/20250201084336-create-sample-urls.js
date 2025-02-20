module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Urls", [
      {
        urlId: 1,
        short_code: "google",
        target_url: "https://www.google.com",
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        urlId: 2,
        short_code: "youtube",
        target_url: "https://www.youtube.com",
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Urls", null, {});
  },
};
