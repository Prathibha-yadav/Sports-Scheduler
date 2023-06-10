/* eslint-disable */
"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Sessions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sportName: {
        type: Sequelize.STRING,
      },
      time: {
        type: Sequelize.DATE,
      },
      venue: {
        type: Sequelize.STRING,
      },
      players: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      playerCount: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Sessions");
  },
};
