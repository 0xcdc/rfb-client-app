import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form } from 'react-bootstrap';

export function clone(obj) {
  return Object.assign({}, obj);
}

function capitalize(v) {
  return v.charAt(0).toUpperCase() + v.substring(1);
}

export function SimpleFormGroup(props) {
  const style = {};
  if (props.getValidationState(props.group) === 'error') {
    style.color = 'red';
  } else if (props.getValidationState(props.group) === 'success') {
    style.color = 'green';
  }

  return (
    <Form.Group controlId={`formHorizontal_${props.group}`}>
      <Form.Row>
        <Form.Label column sm={2} style={style}>
          {props.label || capitalize(props.group)}
        </Form.Label>
        <Col>{props.children}</Col>
      </Form.Row>
    </Form.Group>
  );
}

SimpleFormGroup.propTypes = {
  label: PropTypes.string,
  group: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  getValidationState: PropTypes.func.isRequired,
};

SimpleFormGroup.defaultProps = {
  label: null,
};

export const SimpleFormGroupText = React.forwardRef((props, ref) => {
  const obj = { ...props.household, ...props.client };
  const style = {};
  if (props.getValidationState(props.group) === 'error') {
    style.boxShadow = '0 0 0 0.2rem red';
  } else if (props.getValidationState(props.group) === 'success') {
    style.boxShadow = '0 0 0 0.2rem green';
  }

  return (
    <SimpleFormGroup {...props}>
      <Form.Control
        ref={ref}
        style={style}
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
});

SimpleFormGroupText.propTypes = {
  placeholder: PropTypes.string,
  label: PropTypes.string,
};

SimpleFormGroupText.defaultProps = {
  placeholder: null,
  label: null,
};

export function SimpleFormGroupRadio(props) {
  const obj = { ...props.household, ...props.client };
  const inline =
    props.choices.reduce((accumulator, currentValue) => {
      return accumulator + currentValue + 5;
    }).length < 45;
  const style = {};
  if (props.getValidationState(props.group) === 'error') {
    style.color = 'red';
  } else if (props.getValidationState(props.group) === 'success') {
    style.color = 'green';
  }

  return (
    <SimpleFormGroup {...props}>
      {props.choices.map(value => {
        const isChecked = obj[props.group] === value;
        return (
          <Form.Check
            checked={isChecked}
            custom
            id={`${props.group}-${value}-${obj.id}`}
            inline={inline}
            key={`${props.group}-${value}-${obj.id}`}
            label={value}
            name={`${props.group}-${obj.id}`}
            onChange={e => {
              props.onChange(obj, props.group, e.target.value);
            }}
            style={isChecked ? style : {}}
            type="radio"
            value={value}
          />
        );
      })}
    </SimpleFormGroup>
  );
}

export function SimpleFormGroupYesNo(props) {
  const yesNo = ['No', 'Yes']; // no is first so it will equal 0
  const obj = { ...props.household, ...props.client };

  const style = {};
  if (props.getValidationState(props.group) === 'error') {
    style.color = 'red';
  } else if (props.getValidationState(props.group) === 'success') {
    style.color = 'green';
  }

  return (
    <SimpleFormGroup {...props}>
      {yesNo.map((value, index) => {
        const isChecked = Number.parseInt(obj[props.group], 10) === index;
        return (
          <Form.Check
            checked={isChecked}
            custom
            id={`${props.group}-${value}-${obj.id}`}
            inline
            key={`${props.group}-${value}-${obj.id}`}
            label={value}
            name={`${props.group}-${obj.id}`}
            onChange={e => {
              props.onChange(obj, props.group, e.target.value);
            }}
            style={isChecked ? style : {}}
            type="radio"
            value={index}
          />
        );
      })}
    </SimpleFormGroup>
  );
}

const HouseholdTypeFields = {
  address1: PropTypes.string.isRequired,
  address2: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  zip: PropTypes.string.isRequired,
  income: PropTypes.string.isRequired,
  note: PropTypes.string.isRequired,
};

export const HouseholdType = PropTypes.shape(HouseholdTypeFields);

export const ClientType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  disabled: PropTypes.string.isRequired,
  birthYear: PropTypes.string.isRequired,
  refugeeImmigrantStatus: PropTypes.string.isRequired,
  ethnicity: PropTypes.string.isRequired,
  race: PropTypes.string.isRequired,
  speaksEnglish: PropTypes.string.isRequired,
  militaryStatus: PropTypes.string.isRequired,
});

export const HouseholdWithClientsType = PropTypes.shape({
  ...HouseholdTypeFields,
  clients: PropTypes.arrayOf(ClientType).isRequired,
});

const SimpleFormGroupControlPropTypes = {
  group: PropTypes.string.isRequired,
  getValidationState: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  household: HouseholdType,
  client: ClientType,
};

SimpleFormGroupYesNo.propTypes = SimpleFormGroupControlPropTypes;
SimpleFormGroupRadio.propTypes = {
  choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  ...SimpleFormGroupControlPropTypes,
};
SimpleFormGroupText.propTypes = SimpleFormGroupControlPropTypes;

SimpleFormGroupYesNo.defaultProps = {
  household: null,
  client: null,
};
SimpleFormGroupRadio.defaultProps = SimpleFormGroupYesNo.defaultProps;
SimpleFormGroupText.defaultProps = SimpleFormGroupYesNo.defaultProps;

export class TrackingObject {
  constructor(obj, validationFunc, operation, arg) {
    this.value = clone(obj);
    this.savedValue = clone(obj);
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
    this.savedValue = clone(this.value);
  }
}

export function stubClient(householdId) {
  return {
    id: -1,
    householdId,
    name: '',
    disabled: '',
    race: '',
    birthYear: '',
    gender: '',
    refugeeImmigrantStatus: '',
    speaksEnglish: '',
    militaryStatus: '',
    ethnicity: '',
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
    clients: [],
  };
}
