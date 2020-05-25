import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const ClientType = new ObjectType({
  name: 'Client',
  fields: {
    id: { type: new NonNull(IntType) },
    householdId: { type: new NonNull(IntType) },
    name: { type: new NonNull(StringType) },
    disabled: { type: new NonNull(IntType) },
    raceId: { type: new NonNull(IntType) },
    birthYear: { type: new NonNull(StringType) },
    gender: { type: new NonNull(StringType) },
    refugeeImmigrantStatus: { type: new NonNull(IntType) },
    speaksEnglish: { type: new NonNull(IntType) },
    militaryStatus: { type: new NonNull(StringType) },
    ethnicity: { type: new NonNull(StringType) },
    householdSize: { type: new NonNull(IntType) },
    cardColor: { type: new NonNull(StringType) },
    lastVisit: { type: StringType },
    note: { type: StringType },
  },
});

export default ClientType;
