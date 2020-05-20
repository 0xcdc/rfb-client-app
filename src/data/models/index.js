/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import sequelize from '../root';
import City from './City';
import Client from './Client';
import Household from './Household';
import IncomeLevel from './IncomeLevel';
import Visit from './Visit';

function sync() {
  return sequelize.sync();
}

export default { sync };
export { City, Client, Household, IncomeLevel, Visit };
