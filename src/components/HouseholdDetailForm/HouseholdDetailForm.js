import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Form } from 'react-bootstrap';
import s from './HouseholdDetailForm.css';
import {
  HouseholdType,
  SimpleFormGroupText,
  SimpleFormGroupRadio,
} from '../common';

class HouseholdDetailForm extends Component {
  static propTypes = {
    household: HouseholdType.isRequired,
    getValidationState: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
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

  static income = [
    'Unknown',
    '<$24,000',
    '$24,000 - <$40,000',
    '$40,000 - <$64,000',
    '>$64,000',
  ];

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
          <SimpleFormGroupText group="city" {...this.props} />
          <SimpleFormGroupText group="state" {...this.props} />
          <SimpleFormGroupText group="zip" {...this.props} />
          <SimpleFormGroupRadio
            group="incomeLevelId"
            label="Income"
            normalized
            choices={HouseholdDetailForm.income}
            {...this.props}
          />
          <SimpleFormGroupText group="note" {...this.props} />
        </Form>
      </div>
    );
  }
}

export default withStyles(s)(HouseholdDetailForm);
