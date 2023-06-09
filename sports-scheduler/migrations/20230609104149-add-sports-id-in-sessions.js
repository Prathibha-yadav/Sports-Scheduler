/* eslint-disable */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Sessions", "sportId", {
      type: Sequelize.DataTypes.INTEGER,
    });

    await queryInterface.addConstraint("Sessions", {
      fields: ["sportId"],
      type: "foreign key",
      references: {
        table: "Sports",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Sessions", "sportId");
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
