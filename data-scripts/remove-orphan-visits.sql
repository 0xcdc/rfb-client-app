delete from visit where householdId not in (select id from household);
