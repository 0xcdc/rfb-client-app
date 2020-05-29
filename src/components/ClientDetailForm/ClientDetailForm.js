import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Form } from 'react-bootstrap';
import { ClientType } from 'commonPropTypes';
import {
  SimpleFormGroupText,
  SimpleFormGroupRadio,
  SimpleFormGroupSelect,
  SimpleFormGroupYesNo,
} from '../SimpleFormControls';
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
      'Unknown',
      'Asian, Asian-American',
      'Black, African-American, Other African',
      'Latino, Latino American, Hispanic',
      'Hawaiian-Native or Pacific Islander',
      'Indian-American or Alaskan-Native',
      'White or Caucasian',
      'Other Race',
      'Multi-Racial (2+ identified)',
    ].map((v, i) => ({ id: i, value: v }));

    const gender = [
      'Unknown',
      'Female',
      'Male',
      'Transgendered',
    ].map((v, i) => ({ id: i, value: v }));

    const militaryStatus = [
      'Unknown',
      'None',
      'US Military Service (past or present)',
      'Partners of persons with active military service',
    ].map((v, i) => ({ id: i, value: v }));

    const ethnicity = ['Unknown', 'Hispanic, Latino', 'Other'].map((v, i) => ({
      id: i,
      value: v,
    }));

    return (
      <Form>
        <SimpleFormGroupText
          ref={this.name}
          group="name"
          label="Name"
          {...this.props}
        />
        <SimpleFormGroupRadio
          choices={gender}
          group="genderId"
          label="Gender"
          normalized
          {...this.props}
        />
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
          choices={ethnicity}
          group="ethnicityId"
          label="Ethnicity"
          normalized
          {...this.props}
        />
        <SimpleFormGroupSelect
          group="raceId"
          label="Race"
          normalized
          choices={races}
          {...this.props}
        />
        <SimpleFormGroupYesNo
          group="speaksEnglish"
          label="Speaks English"
          {...this.props}
        />
        <SimpleFormGroupRadio
          choices={militaryStatus}
          group="militaryStatusId"
          label="Military Status"
          normalized
          {...this.props}
        />
      </Form>
    );
  }
}

export default withStyles(s)(ClientDetailForm);
