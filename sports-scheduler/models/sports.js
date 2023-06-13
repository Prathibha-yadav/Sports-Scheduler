/* eslint-disable */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Sport.hasMany(models.Session, {
        foreignKey: "sportId",
      });
      Sport.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
    static getSports(userId) {
      return this.findAll();
    }
    static addSports({ sport_name, userId }) {
      return this.create({ sport_name: sport_name, userId: userId });
    }
    static async getSportById(id) {
      console.log("ID:", id);
      const sport = await this.findByPk(id);
      console.log("Sport:", sport);
      return sport;
    }
    static async getSportByName(sportName) {
      const getSport = await this.findOne({
        where: { sport_name: sportName },
      });
      return getSport;
    }
    // static async getSport(name) {
    //   const getSport = await this.findOne({
    //     where: { sport_name: name },
    //   });
    //   return getSport;
    // }
  }
  Sport.init(
    {
      sport_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Sport",
    }
  );
  return Sport;
};
