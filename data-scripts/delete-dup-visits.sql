delete from visit where exists (select * from visit v2 where v2.date = visit.date and v2.householdId = visit.householdId and
v2.id < visit.id);
