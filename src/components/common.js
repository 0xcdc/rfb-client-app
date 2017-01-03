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
  constructor(obj) {
    this.value = clone(obj);
    this.savedValue = clone(obj);
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

  updateSaved() {
    this.savedValue = clone(this.value);
  };

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

  saveChanges(operation, arg) {
    let dataStr = this.getDataString();
    let query = 'mutation{' + operation + "(" + arg + ':' + dataStr + '){' + this.keys().join(' ') +' }}';

    console.log(query);
    var dataAvailable = fetch(query);

    var completed = dataAvailable.then( (v) => {
      this.value = v.data[operation];
      this.updateSaved();
    });

    return completed;
  }
}
