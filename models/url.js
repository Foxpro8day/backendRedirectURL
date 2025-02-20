"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Url extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Url.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Url.init(
    {
      urlId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true, // Đặt làm khóa chính
      },
      short_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      target_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        // Đảm bảo rằng có khóa ngoại
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Phải khớp với tên bảng
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Url",
      tableName: "Urls", // Đảm bảo tên bảng đúng
    }
  );
  return Url;
};
