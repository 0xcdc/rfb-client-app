import {
  GraphQLInt as IntType,
  GraphQLObjectType as ObjectType,
  GraphQLNonNull as NonNull,
  GraphQLString as StringType,
} from 'graphql';

const VisitType = new ObjectType({
  name: 'Visit',
  fields: {
    id: { type: new NonNull(IntType) },
    householdId: { type: new NonNull(IntType) },
    householdVersion: { type: new NonNull(IntType) },
    date: { type: new NonNull(StringType) },
  },
});

export default VisitType;
