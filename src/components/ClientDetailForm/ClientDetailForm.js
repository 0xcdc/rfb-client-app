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
import withStyles from 'isomorphic-style-loader/withStyles';
import { Form } from 'react-bootstrap';
import {
  ClientType,
  SimpleFormGroupText,
  SimpleFormGroupRadio,
  SimpleFormGroupYesNo,
} from '../common';
import s from './ClientDetailForm.css';

class ClientDetailForm extends Component {
  static propTypes = {
    client: ClientType.isRequired,
    getValidationState: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.name = React.createRef();
  }

  componentDidMount() {
    this.focus();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.client.id !== this.props.client.id) {
      this.focus();
    }
  }

  focus() {
    this.name.current.focus();
  }

  render() {
    const races = [
      'Asian, Asian-American',
      'Black, African-American, Other African',
      'Latino, Latino American, Hispanic',
      'Hawaiian-Native or Pacific Islander',
      'Indian-American or Alaskan-Native',
      'White or Caucasian',
      'Other Race',
      'Multi-Racial (2+ identified)',
      'Unknown',
    ];

    const gender = ['Male', 'Female', 'Transgendered'];

    const militaryStatus = [
      'US Military Service (past or present)',
      'Partners of persons with active military service',
      'None',
    ];

    const ethnicity = ['Hispanic, Latino', 'Other'];

    return (
      <Form>
        <SimpleFormGroupText
          ref={this.name}
          group="name"
          label="Name"
          {...this.props}
        />
        <SimpleFormGroupRadio group="gender" choices={gender} {...this.props} />
        <SimpleFormGroupYesNo group="disabled" {...this.props} />
        <SimpleFormGroupText
          group="birthYear"
          label="Birth Year"
          {...this.props}
        />
        <SimpleFormGroupYesNo
          group="refugeeImmigrantStatus"
          label="Refugee or Immigrant"
          {...this.props}
        />
        <SimpleFormGroupRadio
          group="ethnicity"
          choices={ethnicity}
          {...this.props}
        />
        <SimpleFormGroupRadio group="race" choices={races} {...this.props} />
        <SimpleFormGroupYesNo
          group="speaksEnglish"
          label="Speaks English"
          {...this.props}
        />
        <SimpleFormGroupRadio
          group="militaryStatus"
          label="Military Status"
          choices={militaryStatus}
          {...this.props}
        />
      </Form>
    );
  }
}

export default withStyles(s)(ClientDetailForm);
