import React from 'react';
import { stubHousehold } from 'components/stubs';
import Layout from 'components/Layout';
import HouseholdDetail from './HouseholdDetail';

const title = 'RFB Household Detail';
function loadHousehold(id, graphQL) {
  const query = `
    {
      household(id: ${id}) {
        id
        address1
        address2
        cityId
        zip
        incomeLevelId
        note
        clients {
          id
          name
          householdId
          genderId
          disabled
          refugeeImmigrantStatus
          ethnicityId
          raceId
          speaksEnglish
          militaryStatusId
          birthYear
        }
      }
    }`;

  return graphQL(query).then(({ data }) => {
    if (!data || !data.household)
      throw new Error('Failed to load the household detail.');
    return data.household;
  });
}

async function action(context) {
  const id = Number(context.params.householdId);
  const household =
    id === -1 ? stubHousehold() : await loadHousehold(id, context.graphQL);

  return {
    title,
    chunks: ['householdDetail'],
    component: (
      <Layout>
        <HouseholdDetail household={household} />
      </Layout>
    ),
  };
}

export default action;
