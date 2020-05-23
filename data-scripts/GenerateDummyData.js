const firstNames = [
  'Able',
  'Ben',
  'Charlie',
  'Darian',
  'Elle',
  'Fanny',
  'Gretchen',
  'Harold',
  'Indie',
  'Jack',
  'Kelly',
  'Laurie',
  'Mickey',
  'Noah',
  'Oprah',
  'Penelope',
  'Quentin',
  'Russell',
  'Steve',
  'Tina',
  'Urckle',
  'Vicky',
  'Wendy',
  'Xu',
  'Ying',
  'Zed',
];

const lastNames = [
  'Arron',
  'Baker',
  'Cook',
  'Delong',
  'Esparanza',
  'Fitz',
  'Gage',
  'Heron',
  'Iggy',
  'Jeffers',
  'Klein',
  'Lomax',
  'Mouse',
  'Nice',
  'Orange',
  'Phelps',
  'Qi',
  'Raleigh',
  'Savage',
  'Thunder',
  'Usted',
  'Vick',
  'Wild',
  'Xu',
  'Yi',
  'Zevo',
];

const races = [
  'Unknown',
  'Indian-American or Alaskan-Native',
  'Asian, Asian-American',
  'Black, African-American, Other African',
  'Latino, Latino American, Hispanic',
  'Hawaiian-Native or Pacific Islander',
  'White or Caucasian',
  'Other Race',
  'Multi-Racial (2+ identified)',
];

const militaryService = [
  'None',
  'Partners of persons with active military service',
  'US Military Service (past or present)',
];

const ethnicity = ['Hispanic, Latino', 'Other'];

const gender = ['Male', 'Female', 'Transgendered'];

const income = [
  '<$24,000',
  '$24,000 - <$40,000',
  '$40,000 - <$64,000',
  '>$64,000',
];

let nHousehold = 0;
let nClient = 0;

function createClient(household) {
  return {
    name:
      firstNames[nClient % firstNames.length] +
      lastNames[nHousehold % lastNames.length],
    disabled: nClient % 2,
    race: races[nClient % races.length],
    birthYear: 2016 - (nClient % 100),
    gender: gender[nClient % gender.length],
    refugeeImmigrantStatus: nClient % 2,
    speaksEnglish: nClient % 2,
    militaryStatus: militaryService[nClient % militaryService.length],
    ethnicity: ethnicity[nClient % ethnicity.length],
    householdId: household.id,
  };
}

function createVisit(household, nVisit) {
  let date = new Date();
  date.setDate(date.getDate() + nVisit * -7);
  date = date.toUTCString();
  return {
    date,
    householdId: household.id,
  };
}

function createHousehold() {
  const household = {
    address1: '100 Some Street',
    address2: '',
    city: 'Bellevue',
    state: 'WA',
    zip: '98008',
    income: income[nHousehold % income.length],
    note: '',
  };

  let householdSize = (nHousehold % 8) + 1;
  const clients = [];

  while (householdSize > 0) {
    const client = createClient(household, nHousehold, nClient);
    clients.push(client);

    nClient += 1;
    householdSize -= 1;
  }

  let nVisit = (nHousehold % 8) + 1;
  const visits = [];
  while (nVisit > 0) {
    const visit = createVisit(household, nVisit);
    visits.push(visit);

    nVisit -= 1;
  }
}

export default function() {
  const households = [];

  while (nHousehold < lastNames.length) {
    const household = createHousehold(nHousehold);
    households.push(household);
    nHousehold += 1;
  }

  return Promise.all(households);
}
