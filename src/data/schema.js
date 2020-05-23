import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import { clientQuery, clients, updateClient } from './queries/clients';
import {
  householdQuery,
  households,
  updateHousehold,
} from './queries/households';
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
      client: clientQuery,
      clients,
      household: householdQuery,
      households,
      visitsForHousehold,
      visitsForMonth,
      firstVisitsForYear,
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
