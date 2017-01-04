/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Sequelize from 'sequelize';
import sequelize from '../sequelize';
import Household from './Household';

const Client = sequelize.define( 'client', {
  firstName: { type: Sequelize.STRING() },
  lastName: { type: Sequelize.STRING() },
  disabled: { type: Sequelize.STRING() },
  race: { type : Sequelize.STRING() },
  birthYear: { type : Sequelize.INTEGER() },
  gender: { type: Sequelize.STRING() },
  refugeeImmigrantStatus: { type: Sequelize.STRING() },
  limitedEnglishProficiency: { type: Sequelize.STRING() },
  militaryStatus: { type: Sequelize.STRING() },
  dateEntered: { type: Sequelize.STRING() },
  enteredBy: { type: Sequelize.STRING() },
  ethnicity: { type: Sequelize.STRING() },
}, {
  indexes: [{
    fields: ["householdId"]
  }]
});

Client.belongsTo(Household);
Household.hasMany(Client);

export default Client;