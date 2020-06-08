import database from '../root';

export const incrementHouseholdVersion = database.transaction(householdId => {
  database.run(
    `
    insert into household (id, version, address1, address2, cityId, zip, note, incomeLevelId)
      select id, version+1, address1, address2, cityId, zip, note, incomeLevelId
      from household
      where household.id = :householdId
        and not exists (
          select 1
          from household h2
          where household.id = h2.id
            and h2.version > household.version
        )`,
    { householdId },
  );

  const householdVersion = database.getMaxVersion('household', householdId);

  database.run(
    `
    insert into household_client_list (householdId, householdVersion, clientId, clientVersion)
      select householdId, :householdVersion, clientId, clientVersion
        from household_client_list
        where householdId = :householdId
          and householdVersion = :householdVersion - 1`,
    { householdVersion, householdId },
  );

  return householdVersion;
});

export { incrementHouseholdVersion as default };
