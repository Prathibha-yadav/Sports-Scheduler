/* eslint-disable */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class sports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static getSports(userId) {
      return this.findAll();
    }
    static addSports({ sport_name, userId }) {
      return this.create({ sport_name: sport_name, userId: userId });
    }
    static getSportById(id) {
      return this.findByPk(id);
    }
    // static async getSport(name) {
    //   const getSport = await this.findOne({
    //     where: { sport_name: name },
    //   });
    //   return getSport;
    // }
  }
  sports.init(
    {
      sport_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "sports",
    }
  );
  return sports;
};
