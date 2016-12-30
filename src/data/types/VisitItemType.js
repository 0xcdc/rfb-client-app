/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLNonNull as NonNull,
  GraphQLString as StringType,
  GraphQLInt as IntType,
} from 'graphql';

const VisitItemType = new ObjectType({
  name: 'VisitItem',
  fields: {
    "id": { type: new NonNull(IntType) },
    "householdId": { type: new NonNull(IntType) },
    "date": { type: new NonNull(StringType) },
  },
});

export default VisitItemType;

