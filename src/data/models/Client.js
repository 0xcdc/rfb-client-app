import Sequelize from 'sequelize';
import sequelize from '../root';
import Household from './Household';

const Client = sequelize.define(
  'client',
  {
    name: { type: Sequelize.STRING() },
    disabled: { type: Sequelize.STRING() },
    race: { type: Sequelize.STRING() },
    birthYear: { type: Sequelize.INTEGER() },
    gender: { type: Sequelize.STRING() },
    refugeeImmigrantStatus: { type: Sequelize.STRING() },
    speaksEnglish: { type: Sequelize.STRING() },
    militaryStatus: { type: Sequelize.STRING() },
    ethnicity: { type: Sequelize.STRING() },
  },
  {
    indexes: [
      {
        fields: ['householdId'],
      },
    ],
    timestamps: false,
  },
);

Client.belongsTo(Household);
Household.hasMany(Client);

export default Client;
