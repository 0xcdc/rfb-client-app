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

const Client = Model.define('Client', {
  /*householdId: {
    type: Datatype.INTEGER,
    references: {
      model*/
  firstName: { type: Datatype.STRING() },
  lastName: { type: Datatype.STRING() },
  disabled: { type: Datatype.STRING() },
  race: {type : Datatype.STRING() },
  /*birthYear: {type : new NonNull(StringType) },
  gender: {type : new NonNull(StringType) },
  refugeeImmigrantStatus: {type : new NonNull(StringType) },
  limitedEnglishProficiency: {type : new NonNull(StringType) },
  militaryStatus: {type : new NonNull(StringType) },
  dateEntered: {type : new NonNull(StringType) },
  enteredBy: {type : new NonNull(StringType) },
  ethnicity: {type : new NonNull(StringType) },*/
}, {
  indexes: [

  ],

});

export default Client;
