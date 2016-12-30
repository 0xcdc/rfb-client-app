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

const Visit = Model.define( 'visit', {
  date: { type: DataType.STRING() },
}, {
  indexes: [{
    fields: ['householdId']
  }],
});

Visit.belongsTo(Household, {onDelete: 'CASCADE'});
Household.hasMany(Visit);

export default Visit;
