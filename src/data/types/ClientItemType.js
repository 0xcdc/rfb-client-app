/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const ClientItemType = new ObjectType({
  name: 'ClientItem',
  fields: {
    "id": { type: new NonNull(IntType) },
    "householdId": { type: new NonNull(IntType) },
    "firstName": { type: new NonNull(StringType) },
    "lastName": { type: new NonNull(StringType) },
    "disabled": { type: new NonNull(StringType) },
    "race": {type : new NonNull(StringType) },
    "birthYear": {type : new NonNull(StringType) },
    "gender": {type : new NonNull(StringType) },
    "refugeeImmigrantStatus": {type : new NonNull(StringType) },
    "limitedEnglishProficiency": {type : new NonNull(StringType) },
    "militaryStatus": {type : new NonNull(StringType) },
    "dateEntered": {type : new NonNull(StringType) },
    "enteredBy": {type : new NonNull(StringType) },
    "ethnicity": {type : new NonNull(StringType) },
    "householdSize": {type: new NonNull(IntType) },
    "cardColor": {type: new NonNull(StringType) },
  },
});

export default ClientItemType;
