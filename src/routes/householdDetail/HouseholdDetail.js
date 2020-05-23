import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './HouseholdDetail.css';
import EditDetailForm from '../../components/EditDetailForm';
import { HouseholdWithClientsType } from '../../components/common';

class HouseholdDetail extends React.Component {
  static propTypes = {
    household: HouseholdWithClientsType.isRequired,
  };

  render() {
    return <EditDetailForm household={this.props.household} />;
  }
}

export default withStyles(s)(HouseholdDetail);
