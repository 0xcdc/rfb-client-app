import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form } from 'react-bootstrap';

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
  // render inline if the total length of the values is < 45
  const inline =
    props.choices.reduce((accumulator, currentValue) => {
      const { value } = currentValue;
      return accumulator + value.length + 5;
    }, 0) < 45;
  const style = {};
  if (props.getValidationState(props.group) === 'error') {
    style.color = 'red';
  } else if (props.getValidationState(props.group) === 'success') {
    style.color = 'green';
  }

  return (
    <SimpleFormGroup {...props}>
      {props.choices.map(({ id, value }) => {
        const v = props.normalized ? id : value;
        const isChecked = obj[props.group] === v;
        return (
          <Form.Check
            checked={isChecked}
            custom
            id={`${props.group}-${id}-${obj.id}`}
            inline={inline}
            key={`${props.group}-${value}-${obj.id}`}
            label={value}
            name={`${props.group}-${obj.id}`}
            onChange={() => {
              props.onChange(obj, props.group, v);
            }}
            style={isChecked ? style : {}}
            type="radio"
            value={v}
          />
        );
      })}
    </SimpleFormGroup>
  );
}

export function SimpleFormGroupSelect(props) {
  const obj = { ...props.household, ...props.client };

  const style = {};
  if (props.getValidationState(props.group) === 'error') {
    style.color = 'red';
  } else if (props.getValidationState(props.group) === 'success') {
    style.color = 'green';
  }

  return (
    <SimpleFormGroup {...props}>
      <Form.Control
        as="select"
        custom
        onChange={e => {
          let { value } = e.target;
          if (props.normalized) {
            value = parseInt(value, 10);
          }
          props.onChange(obj, props.group, value);
        }}
        value={obj[props.group]}
      >
        {props.choices.map(({ id, value }) => {
          const v = props.normalized ? id : value;
          const isSelected = obj[props.group] === v;
          return (
            <option
              id={`${props.group}-${value}-${obj.id}`}
              key={`${props.group}-${value}-${obj.id}`}
              name={`${props.group}-${obj.id}`}
              style={isSelected ? style : {}}
              value={v}
            >
              {value}
            </option>
          );
        })}
      </Form.Control>
    </SimpleFormGroup>
  );
}

export function SimpleFormGroupYesNo(props) {
  const yesNo = [
    { id: -1, value: 'Unknown' },
    { id: 0, value: 'No' },
    { id: 1, value: 'Yes' },
  ];
  const obj = { ...props.household, ...props.client };

  const style = {};
  if (props.getValidationState(props.group) === 'error') {
    style.color = 'red';
  } else if (props.getValidationState(props.group) === 'success') {
    style.color = 'green';
  }

  return (
    <SimpleFormGroup {...props}>
      {yesNo.map(({ id, value }) => {
        const isChecked = Number.parseInt(obj[props.group], 10) === id;
        return (
          <Form.Check
            checked={isChecked}
            custom
            id={`${props.group}-${value}-${obj.id}`}
            inline
            key={`${props.group}-${value}-${obj.id}`}
            label={value}
            name={`${props.group}-${obj.id}`}
            onChange={() => {
              props.onChange(obj, props.group, id);
            }}
            style={isChecked ? style : {}}
            type="radio"
            value={id}
          />
        );
      })}
    </SimpleFormGroup>
  );
}

const HouseholdTypeFields = {
  address1: PropTypes.string.isRequired,
  address2: PropTypes.string.isRequired,
  cityId: PropTypes.number.isRequired,
  zip: PropTypes.string.isRequired,
  incomeLevelId: PropTypes.number.isRequired,
  note: PropTypes.string.isRequired,
};

export const HouseholdType = PropTypes.shape(HouseholdTypeFields);

export const ClientType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  disabled: PropTypes.number.isRequired,
  birthYear: PropTypes.string.isRequired,
  refugeeImmigrantStatus: PropTypes.number.isRequired,
  ethnicity: PropTypes.string.isRequired,
  raceId: PropTypes.number.isRequired,
  speaksEnglish: PropTypes.number.isRequired,
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
  choices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  ...SimpleFormGroupControlPropTypes,
};
SimpleFormGroupSelect.propTypes = SimpleFormGroupRadio.propTypes;
SimpleFormGroupText.propTypes = SimpleFormGroupControlPropTypes;

SimpleFormGroupYesNo.defaultProps = {
  household: null,
  client: null,
};
SimpleFormGroupRadio.defaultProps = SimpleFormGroupYesNo.defaultProps;
SimpleFormGroupSelect.defaultProps = SimpleFormGroupYesNo.defaultProps;
SimpleFormGroupText.defaultProps = SimpleFormGroupYesNo.defaultProps;

export class TrackingObject {
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
