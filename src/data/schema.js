/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import {client, clients} from './queries/clients';
import {household} from './queries/households';
import {visits, visitsForHousehold} from './queries/visits';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      client,
      clients,
      household,
      visits,
      visitsForHousehold
    },
  }),
});

export default schema;
