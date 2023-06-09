/* eslint-disable */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.addColumn("session", "userId", {
    //   type: Sequelize.DataTypes.INTEGER,
    // });
    // await queryInterface.addConstraint("session", {
    //   fields: ["userId"],
    //   type: "foreign key",
    //   references: {
    //     table: "users",
    //     field: "id",
    //   },
    // });
    // await queryInterface.addColumn("Sessions", "sportId", {
    //   type: Sequelize.DataTypes.INTEGER,
    // });
    // await queryInterface.addConstraint("Sessions", {
    //   fields: ["sportId"],
    //   type: "foreign key",
    //   references: {
    //     table: "sports",
    //     field: "id",
    //   },
    // });
  },

  async down(queryInterface, Sequelize) {
    //await queryInterface.removeColumn('Session', 'sportId');
  },
};
