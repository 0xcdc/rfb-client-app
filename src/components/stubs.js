export function stubClient(householdId) {
  return {
    id: -1,
    householdId,
    name: '',
    disabled: -1,
    raceId: 0,
    birthYear: '',
    gender: '',
    refugeeImmigrantStatus: -1,
    speaksEnglish: -1,
    militaryStatus: '',
    ethnicity: '',
  };
}

export function stubHousehold() {
  return {
    id: -1,
    address1: '',
    address2: '',
    cityId: 0,
    zip: '',
    incomeLevelId: 0,
    note: '',
    clients: [],
  };
}
