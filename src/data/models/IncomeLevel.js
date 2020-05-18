import Sequelize from 'sequelize';
import sequelize from '../root';
import Household from './Household';

const IncomeLevel = sequelize.define(
  'income_level',
  {
    income_level: { type: Sequelize.STRING() },
  },
  {
    timestamps: false,
  },
);

IncomeLevel.hasOne(Household);

export default IncomeLevel;
