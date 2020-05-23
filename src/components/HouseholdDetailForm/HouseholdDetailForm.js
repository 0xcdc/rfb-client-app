import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Form } from 'react-bootstrap';
import s from './HouseholdDetailForm.css';
import {
  HouseholdType,
  SimpleFormGroupText,
  SimpleFormGroupRadio,
  SimpleFormGroupSelect,
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

  static city = [
    'Unknown',
    'Algona',
    'Ames Lake',
    'Auburn',
    'Baring',
    'Beaux Arts Village',
    'Bellevue',
    'Berrydale',
    'Black Diamond',
    'Bonney Lake',
    'Bothell',
    'Boulevard Park',
    'Bruster',
    'Bryn Mawr',
    'Burien',
    'Carnation',
    'Clyde Hill',
    'Cottage Lake',
    'Covington',
    'Des Moines',
    'Duvall',
    'East Renton Highlands',
    'Enumclaw',
    'Everett',
    'Fairwood',
    'Fall City',
    'Federal Way',
    'Fife',
    'Hobart',
    'Hunts Point',
    'Issaquah',
    'Kenmore',
    'Kent',
    'Kirkland',
    'Klahanie',
    'Lake City',
    'Lake Desire',
    'Lake Forest Park',
    'Lake Holm',
    'Lake Marcel',
    'Lake Morton',
    'Lakeland North',
    'Lakeland South',
    'Lynnwood',
    'Maple Falls',
    'Maple Heights',
    'Maple Valley',
    'Medina',
    'Mercer Island',
    'Mill Creek',
    'Milton',
    'Mirrormont',
    'Monroe',
    'Mountlake Terrace',
    'Newcastle',
    'Normandy Park',
    'North Bend',
    'Novelty Hill',
    'Olympia',
    'Pacific',
    'Puyallup',
    'Pullman',
    'Ravensdale',
    'Redmond',
    'Renton',
    'Reverton',
    'Riverband',
    'Sammamish',
    'SeaTac',
    'Seattle',
    'Shadow Lake',
    'Shoreline',
    'Skykomish',
    'Skyway',
    'Snohomish',
    'Snoqualmie',
    'Stillwater',
    'Sultan',
    'Tacoma',
    'Tanner',
    'Toppenish',
    'Tukwila',
    'Union Hill',
    'Vashon',
    'Vashon Island',
    'Westwood',
    'White Center',
    'White Salmon',
    'Wilderness Run',
    'Woodinville',
    'Yarrow Point',
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
          <SimpleFormGroupSelect
            group="cityId"
            label="City"
            normalized
            choices={HouseholdDetailForm.city}
            {...this.props}
          />
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
