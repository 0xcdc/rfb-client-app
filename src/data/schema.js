import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import { city, cities } from './queries/cities';
import { clientQuery, clients, updateClient } from './queries/clients';
import {
  householdQuery,
  households,
  updateHousehold,
} from './queries/households';
import { incomeLevel, incomeLevels } from './queries/lookupTable';
import {
  deleteVisit,
  firstVisitsForYear,
  visitsForHousehold,
  visitsForMonth,
  recordVisitMutation,
} from './queries/visits';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      city,
      cities,
      client: clientQuery,
      clients,
      firstVisitsForYear,
      household: householdQuery,
      households,
      incomeLevel,
      incomeLevels,
      visitsForHousehold,
      visitsForMonth,
    },
  }),
  mutation: new ObjectType({
    name: 'Mutation',
    fields: {
      deleteVisit,
      recordVisit: recordVisitMutation,
      updateClient,
      updateHousehold,
    },
  }),
});

export default schema;
