/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Col, Form, FormGroup, FormControl } from 'react-bootstrap';
import s from './HouseholdDetailForm.css';

const FormControlStatic = FormControl.Static;

class HouseholdDetailForm extends Component {
  static propTypes = {
    household: PropTypes.shape({
      value: PropTypes.shape({
        address1: PropTypes.string.isRequired,
        address2: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        state: PropTypes.string.isRequired,
        zip: PropTypes.string.isRequired,
        income: PropTypes.string.isRequired,
        note: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    focus: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.focus = this.focus.bind(this);
  }

  componentDidUpdate() {
    this.focus();
  }

  componentDidMount() {
    this.focus();
  }

  focus() {
    if (this.props.focus && this.textInput) {
      this.textInput.focus();
    }
  }

  createHandleChange(prop) {
    return e => {
      const household = this.props.household;
      household.value[prop] = e.target.value;
      household.signalChanges();
    };
  }

  income = ['<$24,000', '$24,000 - <$40,000', '$40,000 - <$64,000', '>$64,000'];

  handleSave() {
    const completed = this.state.household.saveChanges(
      'updateHousehold',
      'household',
    );
    completed.then(() => {
      const household = this.state.household;
      this.setState({ household });
    });
  }

  prettyPrintProperNoun(noun) {
    return noun
      .split(' ')
      .map(p => p.slice(0, 1).toUpperCase() + p.slice(1).toLowerCase())
      .join(' ');
  }

  render() {
    return (
      <div>
        <Form horizontal>
          <FormGroup
            controlId="formHorizontalAddress1"
            validationState={this.props.household.getValidationState(
              'address1',
            )}
          >
            <Col componentClass={ControlLabel} sm={2}>
              Address (line 1)
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Enter address (line 1)"
                value={this.props.household.value.address1}
                onChange={this.createHandleChange('address1')}
                inputRef={ref => {
                  this.textInput = ref;
                }}
              />
            </Col>
          </FormGroup>

          <FormGroup
            controlId="formHorizontalAddress2"
            validationState={this.props.household.getValidationState(
              'address2',
            )}
          >
            <Col componentClass={ControlLabel} sm={2}>
              Address (line 2)
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Enter Address (line 2)"
                value={this.props.household.value.address2}
                onChange={this.createHandleChange('address2')}
              />
            </Col>
          </FormGroup>

          <FormGroup
            controlId="formHorizontalCity"
            validationState={this.props.household.getValidationState('city')}
          >
            <Col componentClass={ControlLabel} sm={2}>
              City
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Enter City"
                value={this.prettyPrintProperNoun(
                  this.props.household.value.city,
                )}
                onChange={this.createHandleChange('city')}
              />
            </Col>
          </FormGroup>

          <FormGroup
            controlId="formHorizontalState"
            validationState={this.props.household.getValidationState('state')}
          >
            <Col componentClass={ControlLabel} sm={2}>
              State
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Enter State"
                value={this.props.household.value.state}
                onChange={this.createHandleChange('state')}
              />
            </Col>
          </FormGroup>

          <FormGroup
            controlId="formHorizontalZip"
            validationState={this.props.household.getValidationState('zip')}
          >
            <Col componentClass={ControlLabel} sm={2}>
              Zip
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Enter Zip"
                value={this.props.household.value.zip}
                onChange={this.createHandleChange('zip')}
              />
            </Col>
          </FormGroup>

          <FormGroup
            controlId="formHorizontalIncome"
            validationState={this.props.household.getValidationState('income')}
          >
            <Col componentClass={ControlLabel} sm={2}>
              Income
            </Col>
            <Col sm={10}>
              {this.income.map(value => (
                <Form.Check
                  type="radio"
                  key={`income-${value}`}
                  value={value}
                  checked={this.props.household.value.income == value}
                  onChange={this.createHandleChange('income')}
                >
                  {value}
                </Form.Check>
              ))}
              )}
            </Col>
          </FormGroup>

          <FormGroup
            controlId="formHorizontalNote"
            validationState={this.props.household.getValidationState('note')}
          >
            <Col componentClass={ControlLabel} sm={2}>
              Note
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                value={this.props.household.value.note}
                onChange={this.createHandleChange('note')}
              />
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

export default withStyles(s)(HouseholdDetailForm);
