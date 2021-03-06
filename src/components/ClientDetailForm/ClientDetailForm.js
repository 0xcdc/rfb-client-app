import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Button, Form } from 'react-bootstrap';
import { ClientType } from 'commonPropTypes';
import {
  SimpleFormGroupText,
  SimpleFormGroupRadio,
  SimpleFormGroupSelect,
} from '../SimpleFormControls';
import s from './ClientDetailForm.css';

class ClientDetailForm extends Component {
  static propTypes = {
    client: ClientType.isRequired,
    getValidationState: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    races: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ).isRequired,
    genders: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ).isRequired,
    militaryStatuses: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ).isRequired,
    ethnicities: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ).isRequired,
    yesNos: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ).isRequired,
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
    return (
      <Form>
        <SimpleFormGroupText
          ref={this.name}
          group="name"
          label="Name"
          {...this.props}
        />
        <SimpleFormGroupRadio
          choices={this.props.genders}
          group="genderId"
          label="Gender"
          normalized
          {...this.props}
        />
        <SimpleFormGroupRadio
          choices={this.props.yesNos}
          group="disabled"
          normalized
          {...this.props}
        />
        <SimpleFormGroupText
          group="birthYear"
          label="Birth Year"
          {...this.props}
        />
        <SimpleFormGroupRadio
          choices={this.props.yesNos}
          group="refugeeImmigrantStatus"
          label="Refugee or Immigrant"
          normalized
          {...this.props}
        />
        <SimpleFormGroupRadio
          choices={this.props.ethnicities}
          group="ethnicityId"
          label="Ethnicity"
          normalized
          {...this.props}
        />
        <SimpleFormGroupSelect
          choices={this.props.races}
          group="raceId"
          label="Race"
          normalized
          {...this.props}
        />
        <SimpleFormGroupRadio
          choices={this.props.yesNos}
          group="speaksEnglish"
          label="Speaks English"
          normalized
          {...this.props}
        />
        <SimpleFormGroupRadio
          choices={this.props.militaryStatuses}
          group="militaryStatusId"
          label="Military Status"
          normalized
          {...this.props}
        />
        <Button
          variant="link"
          className={s.xButton}
          size="sm"
          onClick={() => {
            this.props.onDelete(this.props.client);
          }}
        >
          Delete this Client
        </Button>
      </Form>
    );
  }
}

export default withStyles(s)(ClientDetailForm);
