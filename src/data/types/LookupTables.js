import {
  GraphQLInt as IntType,
  GraphQLObjectType as ObjectType,
  GraphQLNonNull as NonNull,
  GraphQLString as StringType,
} from 'graphql';

const LookupTableType = new ObjectType({
  name: 'LookupTable',
  fields: {
    id: { type: new NonNull(IntType) },
    value: { type: new NonNull(StringType) },
  },
});

export default LookupTableType;
