/* eslint-disable */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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

    static addSession({
      sportName,
      time,
      venue,
      players,
      playerCount,
      status,
    }) {
      return this.create({
        sportName: sportName,
        time: time,
        venue: venue,
        players: players,
        playerCount: playerCount,
        status: status,
      });
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
