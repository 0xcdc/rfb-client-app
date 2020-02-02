import React from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  ControlLabel,
  FormGroup,
  FormControl,
  Radio,
} from 'react-bootstrap';

export function clone(obj) {
  return Object.assign({}, obj);
}

export function capitalize(v) {
  return v.charAt(0).toUpperCase() + v.substring(1);
}

export function SimpleFormGroup(props) {
  return (
    <FormGroup
      controlId={`formHorizontal_${props.group}`}
      validationState={props.getValidationState(props.group)}
    >
      <Col componentClass={ControlLabel} sm={2}>
        {props.label || capitalize(props.group)}
      </Col>
      <Col sm={10}>{props.children}</Col>
    </FormGroup>
  );
}

SimpleFormGroup.propTypes = {
  group: PropTypes.string.isRequired,
  getValidationState: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export function SimpleFormGroupText(props) {
  const obj = { ...props.household, ...props.client };
  return (
    <SimpleFormGroup {...props}>
      <FormControl
        type="text"
        placeholder={
          props.placeholder || `Enter ${props.label || capitalize(props.group)}`
        }
        value={obj[props.group] || ''}
        onChange={e => {
          props.onChange(obj, props.group, e.target.value);
        }}
      />
    </SimpleFormGroup>
  );
}

export function SimpleFormGroupRadio(props) {
  const obj = { ...props.household, ...props.client };
  const inline =
    props.choices.reduce((accumulator, currentValue) => {
      return accumulator + currentValue + 5;
    }).length < 45;
  return (
    <SimpleFormGroup {...props}>
      {props.choices.map(value => {
        return (
          <Radio
            key={`${props.group}-${value}`}
            value={value}
            inline={inline}
            checked={obj[props.group] === value}
            onChange={e => {
              props.onChange(obj, props.group, e.target.value);
            }}
          >
            {value}
          </Radio>
        );
      })}
    </SimpleFormGroup>
  );
}

export function SimpleFormGroupCheckBox(props) {
  const yesNo = ['No', 'Yes']; // no is first so it will equal 0
  const obj = { ...props.household, ...props.client };
  return (
    <SimpleFormGroup {...props}>
      {yesNo.map((value, index) => {
        return (
          <Radio
            key={`${props.group}-${value}`}
            inline
            value={index}
            checked={Number.parseInt(obj[props.group], 10) === index}
            onChange={e => {
              props.onChange(obj, props.group, e.target.value);
            }}
          >
            {value}
          </Radio>
        );
      })}
    </SimpleFormGroup>
  );
}

export const HouseholdType = PropTypes.shape({
  address1: PropTypes.string.isRequired,
  address2: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  zip: PropTypes.string.isRequired,
  income: PropTypes.string.isRequired,
  note: PropTypes.string.isRequired,
});

export const ClientType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  disabled: PropTypes.string.isRequired,
  birthYear: PropTypes.string.isRequired,
  refugeeImmigrantStatus: PropTypes.string.isRequired,
  ethnicity: PropTypes.string.isRequired,
  race: PropTypes.string.isRequired,
  speaksEnglish: PropTypes.string.isRequired,
  militaryStatus: PropTypes.string.isRequired,
});

const SimpleFormGroupControlPropTypes = {
  placeholder: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  group: PropTypes.string.isRequired,
  getValidationState: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  household: HouseholdType,
  client: ClientType,
};

SimpleFormGroupCheckBox.propTypes = SimpleFormGroupControlPropTypes;
SimpleFormGroupRadio.propTypes = {
  choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  ...SimpleFormGroupControlPropTypes,
};
SimpleFormGroupText.propTypes = SimpleFormGroupControlPropTypes;

SimpleFormGroupCheckBox.defaultProps = {
  household: null,
  client: null,
};
SimpleFormGroupRadio.defaultProps = SimpleFormGroupCheckBox.defaultProps;
SimpleFormGroupText.defaultProps = SimpleFormGroupCheckBox.defaultProps;

export class TrackingObject {
  constructor(obj, validationFunc, operation, arg) {
    this.value = clone(obj);
    this.savedValue = clone(obj);
    this.validationFunc = validationFunc;
    this.operation = operation;
    this.arg = arg;
  }

  hasAnyChanges() {
    return this.keys().some(k => {
      return this.hasChanges(k);
    });
  }

  hasChanges(k) {
    const isEqual = this.value[k] === this.savedValue[k];
    return !isEqual;
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
      if (this.isInvalid(key)) return 'error';
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
    this.savedValue = clone(this.value);
  }
}

export function stubClient(householdId) {
  return {
    id: -1,
    householdId,
    firstName: '',
    lastName: '',
    disabled: '',
    race: '',
    birthYear: '',
    gender: '',
    refugeeImmigrantStatus: '',
    speaksEnglish: '',
    militaryStatus: '',
    ethnicity: '',
    dateEntered: '',
    enteredBy: '',
  };
}

export function stubHousehold() {
  return {
    id: -1,
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    income: '',
    note: '',
    oldHouseholdId: '',
    dateEntered: '',
    enteredBy: '',
    clients: [],
  };
}
