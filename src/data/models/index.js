/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import sequelize from '../root';
import Client from './Client';
import Household from './Household';
import Visit from './Visit';
import generateDummyData from './GenerateDummyData';

function sync() {
  return sequelize.sync();
}

export default { sync };
export { Client, Household, Visit };
