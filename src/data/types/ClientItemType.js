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
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const ClientItemType = new ObjectType({
  name: 'ClientItem',
  fields: {
    id: { type: new NonNull(IntType) },
    name: { type: new NonNull(StringType) },
  },
});

export default ClientItemType;
