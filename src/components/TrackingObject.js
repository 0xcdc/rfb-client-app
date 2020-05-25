class TrackingObject {
  constructor(obj, validationFunc, operation, arg) {
    this.value = { ...obj };
    this.savedValue = { ...obj };
    this.validationFunc = validationFunc;
    this.operation = operation;
    this.arg = arg;
  }

  hasChanges(k) {
    if (k) {
      return this.value[k] !== this.savedValue[k];
    }

    return this.keys().some(key => {
      return this.hasChanges(key);
    });
  }

  isInvalid(key) {
    if (key) {
      if (this.validationFunc) {
        return this.validationFunc(key, this.value[key]);
      }
      return false;
    }

    return (
      this.keys()
        .map(k => {
          return this.isInvalid(k);
        })
        .find(v => {
          return v !== false;
        }) || false
    );
  }

  keys() {
    return Object.keys(this.value);
  }

  getDataString(keysArg) {
    let keys = keysArg;
    if (!keys) keys = this.keys();

    const data = keys.map(k => {
      return `${k}: ${JSON.stringify(this.value[k])}`;
    });
    const dataStr = `{  ${data.join(', ')} }`;

    return dataStr;
  }

  getValidationState(key) {
    if (key) {
      if (this.isInvalid(key)) return 'danger';
      if (this.hasChanges(key)) return 'success';
      return null;
    }

    const retval = {};
    this.keys().forEach(k => {
      retval[k] = this.getValidationState(k);
    });
    return retval;
  }

  saveChanges(graphQL) {
    const dataStr = this.getDataString();
    const query = `
mutation{
  ${this.operation}(
    ${this.arg}: ${dataStr}
  ) {
      ${this.keys().join(' ')}
    }
}`;

    let future = graphQL(query);

    future = future.then(v => {
      this.value = v.data[this.operation];
      this.updateSaved();
      return this.value;
    });

    return future;
  }

  updateSaved() {
    this.savedValue = { ...this.value };
  }
}

export { TrackingObject as default };
