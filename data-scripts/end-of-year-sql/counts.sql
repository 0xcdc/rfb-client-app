with data as (
  select *
    from city
    left join (
      select cityId,
        count(distinct household.id) "Unduplicated_Households", count(client.id) as "Unduplicated_Individuals"
      from households_visited_last_year
      join household
        on household.id = households_visited_last_year.id and
           household.version = households_visited_last_year.version
      left join household_client_list hcl
        on household.id = hcl.householdId and
           household.version = hcl.householdVersion
      left join client
        on client.id= hcl.clientId and
           client.version = hcl.clientVersion
      group by cityId
    ) d
    on city.id = d.cityId
)

select id,
  name,
  coalesce(Unduplicated_Households, 0) as "Unduplicated_Households",
  coalesce(Unduplicated_Individuals, 0) as "Unduplicated_Individuals"
from data
where break_out = 1
union all
select 100, 'Other KC', sum(data.Unduplicated_Households), sum(data.Unduplicated_Individuals)
from data
where break_out = 0 and in_king_county = 1
union all
select 101, 'Outside KC', sum(data.Unduplicated_Households), sum(data.Unduplicated_Individuals)
from data
where break_out = 0 and in_king_county = 0
union all
select 102, 'Unknown', sum(data.Unduplicated_Households), sum(data.Unduplicated_Individuals)
from data
where id = 0
order by id;
