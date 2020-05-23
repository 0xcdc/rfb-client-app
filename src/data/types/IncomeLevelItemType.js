import {
  GraphQLInt as IntType,
  GraphQLObjectType as ObjectType,
  GraphQLNonNull as NonNull,
  GraphQLString as StringType,
} from 'graphql';

const IncomeLevelItemType = new ObjectType({
  name: 'IncomeLevelItem',
  fields: {
    id: { type: new NonNull(IntType) },
    income_level: { type: new NonNull(StringType) },
  },
});

export default IncomeLevelItemType;
