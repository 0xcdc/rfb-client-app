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

const Household = sequelize.define('Household', {
    "address1": { type: Sequelize.STRING() },
    "address2": { type: Sequelize.STRING() },
    "city": { type: Sequelize.STRING() },
    "state": { type: Sequelize.STRING() },
    "zip": { type: Sequelize.STRING() },
    "income": { type: Sequelize.STRING() },
    "note": { type: Sequelize.STRING() },
    "oldHouseholdId": { type: Sequelize.STRING() },
    "dateEntered": { type: Sequelize.STRING() },
    "enteredBy": { type: Sequelize.STRING() },
     }, {
  indexes: [

  ],

});

export default Household;
