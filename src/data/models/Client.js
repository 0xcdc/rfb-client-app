/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import DataType from 'sequelize';
import Model from '../sequelize';
import Household from './Household';

const Client = Model.define( 'Client', {
  firstName: { type: DataType.STRING() },
  lastName: { type: DataType.STRING() },
  disabled: { type: DataType.STRING() },
  race: { type : DataType.STRING() },
  birthYear: { type : DataType.INTEGER() },
  gender: { type: DataType.STRING() },
  refugeeImmigrantStatus: { type: DataType.STRING() },
  limitedEnglishProficiency: { type: DataType.STRING() },
  militaryStatus: { type: DataType.STRING() },
  dateEntered: { type: DataType.STRING() },
  enteredBy: { type: DataType.STRING() },
  ethnicity: { type: DataType.STRING() },
}, {
  indexes: [

  ],

});

Client.belongsTo(Household);
Household.hasMany(Client);

export default Client;
