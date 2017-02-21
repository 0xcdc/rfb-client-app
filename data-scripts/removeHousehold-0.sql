update visit set householdId = 685 where householdId = 0;
delete from client where householdId = 0;
delete from household where id = 0;

