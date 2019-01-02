export function clone(obj) {
  return Object.assign({}, obj);
};

export class TrackingObject {
  constructor(obj, onChange, validationFunc, operation, arg) {
    this.value = clone(obj);
    this.savedValue = clone(obj);
    this.onChange = onChange;
    this.validationFunc = validationFunc;
    this.operation = operation;
    this.arg = arg;
  };

  hasAnyChanges() {
    return this.keys().some( (k) => {
      return this.hasChanges(k);
    });
  };

  hasChanges(k) {
    let isEqual = this.value[k] == this.savedValue[k];
    return !isEqual;
  };

  isInvalid(key) {
    if(key) {
      if(this.validationFunc) {
        return this.validationFunc(key, this.value[key]);
      } else {
        return false;
      }
    } else {
      let v = this.keys()
        .map( (k) => { return this.isInvalid(k); })
        .find( (v) => { return v != false; }) ||
        false;
      return v;
    }
  }

  keys() {
    return Object.keys(this.value);
  }

  getDataString(keys) {
    if(!keys) keys = this.keys();

    let data = keys.map( (k) => {
      return k + ": " + JSON.stringify(this.value[k]);
    });
    let dataStr = "{ " + data.join(', ') + '}';

    return dataStr;
  };

  getValidationState(key) {
    if(this.isInvalid(key)) {
      return "error";
    }
    else if (this.hasChanges(key)) {
      return "success";
    }
    else {
      return null;
    }
  }

  saveChanges(graphQL) {
    let dataStr = this.getDataString();
    let query = 'mutation{' + this.operation + "(" + this.arg + ':' + dataStr + '){' + this.keys().join(' ') +' }}';

    var dataAvailable = graphQL(query);

    var completed = dataAvailable.then( (v) => {
      this.value = v.data[this.operation];
      this.updateSaved();
    });

    return completed;
  }

  signalChanges() {
    this.onChange && this.onChange(this.value);
  }

  updateSaved() {
    this.savedValue = clone(this.value);
  };
}

export function stubClient(householdId) {
  return {
    id: -1,
    householdId,
    firstName: "",
    lastName: "",
    disabled: "",
    race: "",
    birthYear: "",
    gender: "",
    refugeeImmigrantStatus: "",
    speaksEnglish: "",
    militaryStatus: "",
    ethnicity: "",
    dateEntered: "",
    enteredBy: "",
  };
}

export function stubHousehold() {
  return {
    id: -1,
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    income: "",
    note: "",
    oldHouseholdId: "",
    dateEntered: "",
    enteredBy: "",
    clients: [
    ]
  };
}

