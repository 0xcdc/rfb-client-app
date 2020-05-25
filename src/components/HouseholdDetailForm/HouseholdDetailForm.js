import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Form } from 'react-bootstrap';
import { HouseholdType } from 'commonPropTypes';
import s from './HouseholdDetailForm.css';
import {
  SimpleFormGroupText,
  SimpleFormGroupRadio,
  SimpleFormGroupSelect,
} from '../common';

class HouseholdDetailForm extends Component {
  static propTypes = {
    household: HouseholdType.isRequired,
    getValidationState: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    cities: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ).isRequired,
    incomeLevels: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ).isRequired,
  };

  constructor(props) {
    super(props);

    this.address1 = React.createRef();
  }

  componentDidMount() {
    this.focus();
  }

  focus() {
    this.address1.current.focus();
  }

  render() {
    return (
      <div>
        <Form>
          <SimpleFormGroupText
            ref={this.address1}
            group="address1"
            label="Address 1"
            {...this.props}
          />

          <SimpleFormGroupText
            group="address2"
            label="Address 2"
            {...this.props}
          />
          <SimpleFormGroupSelect
            group="cityId"
            label="City"
            normalized
            choices={this.props.cities}
            {...this.props}
          />
          <SimpleFormGroupText group="zip" {...this.props} />
          <SimpleFormGroupRadio
            group="incomeLevelId"
            label="Income"
            normalized
            choices={this.props.incomeLevels}
            {...this.props}
          />
          <SimpleFormGroupText group="note" {...this.props} />
        </Form>
      </div>
    );
  }
}

export default withStyles(s)(HouseholdDetailForm);
