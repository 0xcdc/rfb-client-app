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

const Household = Model.define('Household', {
    "address1": { type: DataType.STRING() },
    "address2": { type: DataType.STRING() },
    "city": { type: DataType.STRING() },
    "state": { type: DataType.STRING() },
    "zip": { type: DataType.STRING() },
    "income": { type: DataType.STRING() },
    "householdSize": { type: DataType.STRING() },
    "note": { type: DataType.STRING() },
    "oldHouseholdId": { type: DataType.STRING() },
    "dateEntered": { type: DataType.STRING() },
    "enteredBy": { type: DataType.STRING() },
    //"clients": {type: new ListType(ClientItemType) },
     }, {
  indexes: [

  ],

});

export default Household;
