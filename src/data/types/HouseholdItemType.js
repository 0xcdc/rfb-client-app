/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLInt as IntType,
  GraphQLList as ListType,
  GraphQLObjectType as ObjectType,
  GraphQLNonNull as NonNull,
  GraphQLString as StringType,
} from 'graphql';
import ClientItemType from './ClientItemType';
import CityItemType from './CityItemType';

const HouseholdItemType = new ObjectType({
  name: 'HouseholdItem',
  fields: {
    id: { type: new NonNull(IntType) },
    address1: { type: new NonNull(StringType) },
    address2: { type: new NonNull(StringType) },
    cityId: { type: new NonNull(IntType) },
    zip: { type: new NonNull(StringType) },
    incomeLevelId: { type: new NonNull(IntType) },
    incomeLevel: { type: new NonNull(StringType) },
    householdSize: { type: new NonNull(StringType) },
    note: { type: new NonNull(StringType) },
    clients: { type: new ListType(ClientItemType) },
    city: { type: CityItemType },
  },
});

export default HouseholdItemType;
