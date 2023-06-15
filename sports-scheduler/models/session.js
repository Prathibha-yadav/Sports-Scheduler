/* eslint-disable */
"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    static associate(models) {
      Session.belongsTo(models.User, {
        foreignKey: "userId",
      });
      Session.belongsTo(models.Sport, {
        foreignKey: "sportId",
      });
    }
    static async findByPk(id) {
      return this.findOne({
        where: {
          id: id,
        },
      });
    }
    static getSessions() {
      return this.findAll();
    }
    static async getSessionById(id) {
      console.log("ID:", id);
      const session = await this.findByPk(id);
      console.log("SESSION:", session);
      return session;
    }

    static async completedSessions(sportName) {
      return this.findAll({
        where: {
          sportName: sportName,
          status: false,
          time: {
            // eslint-disable-next-line no-undef
            [Op.lt]: new Date(),
          },
        },
      });
    }
    static async addSession({
      sportName,
      time,
      venue,
      players,
      playerCount,
      status,
      userId,
      sportId,
      sessionId,
    }) {
      try {
        const session = await this.create({
          sportName,
          time,
          venue,
          players,
          playerCount,
          status,
          userId,
          sportId,
          sessionId,
        });
        return session;
      } catch (error) {
        console.error("failed to add session:", error);
        throw new Error("Failed to add session");
      }
    }
  }
  Session.init(
    {
      sportName: DataTypes.STRING,
      time: DataTypes.DATE,
      venue: DataTypes.STRING,
      players: DataTypes.ARRAY(DataTypes.STRING),
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
