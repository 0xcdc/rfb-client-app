'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("household", "oldHouseholdId");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("household", "oldHouseholdId", Sequelize.STRING);
  }
};
