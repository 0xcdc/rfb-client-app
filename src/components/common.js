import realFetch from '../core/fetch';

export function clone(obj) {
  return Object.assign({}, obj);
};

export function fetch(query) {
  return realFetch('/graphql', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
    }),
    credentials: 'include',
  }).then( (response) => {
    return response.json();
  });
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

  isValid(key) {
    if(key) {
      if(this.validationFunc) {
        return this.validationFunc(key, this.value[key]);
      } else {
        return true;
      }
    } else {
      return this.keys().every( (k) => { return this.isValid(k); });
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
    if(!this.isValid(key)) {
      return "error";
    }
    else if (this.hasChanges(key)) {
      return "success";
    }
    else {
      return null;
    }
  }

  saveChanges() {
    let dataStr = this.getDataString();
    let query = 'mutation{' + this.operation + "(" + this.arg + ':' + dataStr + '){' + this.keys().join(' ') +' }}';

    //console.log(query);
    var dataAvailable = fetch(query);

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
