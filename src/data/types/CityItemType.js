import {
  GraphQLInt as IntType,
  GraphQLObjectType as ObjectType,
  GraphQLNonNull as NonNull,
  GraphQLString as StringType,
} from 'graphql';

const CityItemType = new ObjectType({
  name: 'CityItem',
  fields: {
    id: { type: new NonNull(IntType) },
    name: { type: new NonNull(StringType) },
    break_out: { type: new NonNull(IntType) },
    in_king_county: { type: new NonNull(IntType) },
  },
});

export default CityItemType;
