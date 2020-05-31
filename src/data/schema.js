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
import {
  ethnicities,
  ethnicity,
  gender,
  genders,
  incomeLevel,
  incomeLevels,
  militaryStatus,
  militaryStatuses,
  race,
  races,
  yesNo,
  yesNos,
} from './queries/lookupTable';
import {
  deleteVisit,
  firstVisitsForYear,
  visitsForHousehold,
  visitsForMonth,
  recordVisitMutation,
} from './queries/visits';
import { nextKeyMutation } from './queries/keys';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      city,
      cities,
      client: clientQuery,
      clients,
      ethnicities,
      ethnicity,
      firstVisitsForYear,
      gender,
      genders,
      household: householdQuery,
      households,
      incomeLevel,
      incomeLevels,
      militaryStatus,
      militaryStatuses,
      race,
      races,
      visitsForHousehold,
      visitsForMonth,
      yesNo,
      yesNos,
    },
  }),
  mutation: new ObjectType({
    name: 'Mutation',
    fields: {
      deleteVisit,
      nextKey: nextKeyMutation,
      recordVisit: recordVisitMutation,
      updateClient,
      updateHousehold,
    },
  }),
});

export default schema;
