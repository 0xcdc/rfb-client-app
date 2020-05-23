import {
  GraphQLInt as IntType,
  GraphQLList as ListType,
  GraphQLObjectType as ObjectType,
  GraphQLNonNull as NonNull,
  GraphQLString as StringType,
} from 'graphql';
import ClientType from './ClientType';
import CityType from './CityType';

const HouseholdType = new ObjectType({
  name: 'Household',
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
    clients: { type: new ListType(ClientType) },
    city: { type: CityType },
  },
});

export default HouseholdType;
