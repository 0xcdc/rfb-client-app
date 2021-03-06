import PropTypes from 'prop-types';

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
  genderId: PropTypes.number.isRequired,
  disabled: PropTypes.number.isRequired,
  birthYear: PropTypes.string.isRequired,
  refugeeImmigrantStatus: PropTypes.number.isRequired,
  ethnicityId: PropTypes.number.isRequired,
  raceId: PropTypes.number.isRequired,
  speaksEnglish: PropTypes.number.isRequired,
  militaryStatusId: PropTypes.number.isRequired,
});

export const HouseholdWithClientsType = PropTypes.shape({
  ...HouseholdTypeFields,
  clients: PropTypes.arrayOf(ClientType).isRequired,
});
