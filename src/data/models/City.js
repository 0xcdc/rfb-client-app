import Sequelize from 'sequelize';
import sequelize from '../root';
import Household from './Household';

const City = sequelize.define(
  'city',
  {
    name: { type: Sequelize.STRING() },
    break_out: { type: Sequelize.INTEGER() },
    in_king_county: { type: Sequelize.INTEGER() },
  },
  {
    timestamps: false,
  },
);

City.hasOne(Household);

export default City;
