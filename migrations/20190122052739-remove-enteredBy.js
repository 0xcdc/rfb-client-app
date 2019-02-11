'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("household", "enteredBy");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("household", "enteredBy", Sequelize.STRING);
  }
};
