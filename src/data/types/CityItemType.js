/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLInt as IntType,
  GraphQLObjectType as ObjectType,
  GraphQLNonNull as NonNull,
  GraphQLString as StringType,
} from 'graphql';

const CityItemType = new ObjectType({
  name: 'CityItem',
  fields: {
    id: { type: new NonNull(IntType) },
    name: { type: new NonNull(StringType) },
    break_out: { type: new NonNull(IntType) },
    in_king_county: { type: new NonNull(IntType) },
  },
});

export default CityItemType;
