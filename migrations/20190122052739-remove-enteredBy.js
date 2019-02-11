'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("household", "dateEntered");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("household", "dateEntered", Sequelize.STRING);
  }
};
