import Household from './Household';
import Client from './Client';

const firstNames = [
  "Able", "Ben", "Charlie", "Darian", "Elle", "Fanny", "Gretchen", "Harold", "Indie", "Jack", "Kelly", "Laurie",
  "Mickey", "Noah", "Oprah", "Penelope", "Quentin", "Russell", "Steve", "Tina", "Urckle", "Vicky", "Wendy", "Xu",
  "Ying", "Zed"
];

const lastNames = [
  "Arron", "Baker", "Cook", "Delong", "Esparanza", "Fitz", "Gage", "Heron", "Iggy", "Jeffers", "Klein", "Lomax",
  "Mouse", "Nice", "Orange", "Phelps", "Qi", "Raleigh", "Savage", "Thunder", "Usted", "Vick", "Wild", "Xu", "Yi",
  "Zevo"
];

const races = [
  "Unknown",
  "Indian-American or Alaskan-Native",
  "Asian, Asian-American",
  "Black, African-American, Other African",
  "Latino, Latino American, Hispanic",
  "Hawaiian-Native or Pacific Islander",
  "White or Caucasian",
  "Other Race",
  "Multi-Racial (2+ identified)",
];

const militaryService = [
  "None",
  "Partners of persons with active military service",
  "US Military Service (past or present)",
];

const ethnicity = [
  "Hispanic, Latino",
  "Other",
];

const gender = [
  "Male",
  "Female",
  "Transgendered"
];

const income = [
  "<$24,000",
  "$24,000 - <$40,000",
  "$40,000 - <$64,000",
  ">$64,000",
];

function createClient(household, nHousehold, nClient) {
  return household.createClient( {
    firstName: firstNames[nClient % firstNames.length],
    lastName: lastNames[nHousehold % lastNames.length],
    disabled: nClient % 2,
    race: races[nClient % races.length],
    birthYear: 2016 - (nClient % 100),
    gender: gender[nClient % gender.length],
    refugeeImmigrantStatus: nClient % 2,
    limitedEnglishProficiency: nClient % 2,
    militaryStatus: militaryService[nClient % militaryService.length],
    dateEntered: "1/1/2016",
    enteredBy: "dummy data",
    ethnicity: ethnicity[nClient % ethnicity.length],
  });
}

function createHousehold(nHousehold) {
  let household = Household.create( {
    address1: "100 Some Street",
    address2: "",
    city: "Bellevue",
    state: "WA",
    zip: "98008",
    income: income[nHousehold % income.length],
    note: "",
    oldHouseholdId: "",
    dateEntered: "",
    enteredBy: "",
  });
  return Promise.all([household, nHousehold]);
}

function createVisit(household, nVisit) {
  let date = new Date();
  date.setDate(date.getDate() + nVisit * -7);
  date = [date.getFullYear(), date.getMonth(), date.getDate()].join("-");

  household.createVisit({
    date
  });
}


export default function () {
  let households = [];
  
  let nHousehold = 0;
  let nClient = 0;

  while(nHousehold < lastNames.length) {
    let household = createHousehold(nHousehold).then( (values) => {
      let household = values[0];
      let nHousehold = values[1];

      let householdSize = nHousehold % 8 + 1;
      let clients = [];

      while( householdSize > 0) {
        let client = createClient(household, nHousehold, nClient);
        clients.push(client);

        nClient++;
        householdSize--;
      }

      let nVisit = nHousehold % 8 + 1;
      let visits = [];
      while (nVisit > 0) {
        let visit = createVisit(household, nVisit);
        visits.push(visit);

        nVisit--;
      }

      return Promise.all(clients, visits);
    });

    households.push(household);
    nHousehold++;
  };

  return Promise.all(households);
}


