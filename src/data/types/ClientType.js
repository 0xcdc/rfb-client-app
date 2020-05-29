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
    genderId: { type: new NonNull(IntType) },
    refugeeImmigrantStatus: { type: new NonNull(IntType) },
    speaksEnglish: { type: new NonNull(IntType) },
    militaryStatusId: { type: new NonNull(IntType) },
    ethnicityId: { type: new NonNull(IntType) },
    householdSize: { type: new NonNull(IntType) },
    cardColor: { type: new NonNull(StringType) },
    lastVisit: { type: StringType },
    note: { type: StringType },
  },
});

export default ClientType;
