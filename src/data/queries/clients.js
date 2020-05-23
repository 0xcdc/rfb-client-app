import {
  GraphQLList as List,
  GraphQLNonNull as NonNull,
  GraphQLInputObjectType as InputType,
  GraphQLInt as Int,
  GraphQLString as QLString,
} from 'graphql';

import ClientType from '../types/ClientType';
import database from '../root';

function addHouseholdInfo(clientList) {
  clientList.forEach(client => {
    const c = client;
    c.householdSize = clientList.length;

    function cardColor(count) {
      switch (count) {
        case 0:
        case 1:
        case 2:
          return 'red';
        case 3:
        case 4:
          return 'blue';
        case 5:
        case 6:
        case 7:
          return 'yellow';
        default:
          return 'purple';
      }
    }

    c.cardColor = cardColor(c.householdSize);
  });
}

export function loadAll() {
  const clients = database.all(
    `
SELECT c.*, h.note, lv.lastVisit
FROM client c
INNER JOIN household h
  ON c.householdId = h.id
LEFT JOIN (
  SELECT householdId, MAX(date) as lastVisit
  from visit
  group by householdId
) lv
  ON lv.householdId = c.householdId `,
  );

  // group the clients by householdId
  const households = new Map();
  clients.forEach(client => {
    const list = households.get(client.householdId) || [];
    list.push(client);
    households.set(client.householdId, list);
  });

  households.forEach(group => {
    addHouseholdInfo(group);
  });

  return clients;
}

function loadById(id) {
  const clients = loadAll();
  return clients.find(v => v.id === id);
}

export function loadClientsForHouseholdId(householdId) {
  const clients = database.all(
    `
select *
from client
where householdId = :householdId`,
    { householdId },
  );
  addHouseholdInfo(clients);

  return clients;
}

export const clients = {
  type: new List(ClientType),
  resolve() {
    return loadAll();
  },
};

export const clientQuery = {
  type: ClientType,
  args: {
    id: {
      type: new NonNull(Int),
    },
  },
  resolve(root, { id }) {
    return loadById(id);
  },
};

export const updateClient = {
  type: ClientType,
  description: 'Update a Client',
  args: {
    client: {
      name: 'UpdateClientInput',
      type: new InputType({
        name: 'updateClientInput',
        fields: {
          id: { type: new NonNull(Int) },
          householdId: { type: new NonNull(Int) },
          name: { type: new NonNull(QLString) },
          disabled: { type: new NonNull(QLString) },
          race: { type: new NonNull(QLString) },
          birthYear: { type: new NonNull(QLString) },
          gender: { type: new NonNull(QLString) },
          refugeeImmigrantStatus: { type: new NonNull(QLString) },
          speaksEnglish: { type: new NonNull(QLString) },
          militaryStatus: { type: new NonNull(QLString) },
          ethnicity: { type: new NonNull(QLString) },
        },
      }),
    },
  },
  resolve: (root, a) => {
    const { client } = a;
    let { id } = client;
    if (client.id === -1) {
      delete client.id;
      id = database.insert('client', client);
    } else {
      database.update('client', client);
    }
    return loadById(id);
  },
};
