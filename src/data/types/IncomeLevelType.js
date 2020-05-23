import {
  GraphQLInt as IntType,
  GraphQLObjectType as ObjectType,
  GraphQLNonNull as NonNull,
  GraphQLString as StringType,
} from 'graphql';

const IncomeLevelType = new ObjectType({
  name: 'IncomeLevel',
  fields: {
    id: { type: new NonNull(IntType) },
    income_level: { type: new NonNull(StringType) },
  },
});

export default IncomeLevelType;
