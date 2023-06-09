/* eslint-disable */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    static associate(models) {
      // define association here
      // Session.belongsTo(models.sports, {
      //   foreignKey: "sportId",
      // });
      // Session.belongsTo(models.User, {
      //   foreignKey: "userId",
      // });
    }
    static getSessions() {
      return this.findAll();
    }

    static async addSession({
      sportName,
      time,
      venue,
      players,
      playerCount,
      status,
    }) {
      try {
        const session = await this.create({
          sportName,
          time,
          venue,
          players: players ? players.split(",").map(Number) : [],
          playerCount,
          status,
        });
        return session;
      } catch (error) {
        console.error("Failed to add session:", error);
        throw new Error("Failed to add session");
      }
    }
  }
  Session.init(
    {
      sportName: DataTypes.STRING,
      time: DataTypes.DATE,
      venue: DataTypes.STRING,
      players: DataTypes.ARRAY(DataTypes.INTEGER),
      playerCount: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Session",
    }
  );
  return Session;
};
