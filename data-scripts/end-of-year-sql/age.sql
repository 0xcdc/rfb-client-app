with data as (
  select *
    from city
    left join (
      select cityId,
        sum(case when age >= 0 and age <= 5 then 1 else 0 end) as "0 - 5",
        sum(case when age >= 6 and age <= 12 then 1 else 0 end) as "6 - 12",
        sum(case when age >= 13 and age <= 17 then 1 else 0 end) as "13 - 17",
        sum(case when age >= 18 and age <= 24 then 1 else 0 end) as "18 - 24",
        sum(case when age >= 25 and age <= 34 then 1 else 0 end) as "25 - 34",
        sum(case when age >= 35 and age <= 54 then 1 else 0 end) as "35 - 54",
        sum(case when age >= 55 and age <= 74 then 1 else 0 end) as "55 - 74",
        sum(case when age >= 75 and age <= 84 then 1 else 0 end) as "75 - 84",
        sum(case when age >= 85 then 1 else 0 end) as "85+",
        sum(case when age is null then 1 else 0 end) as Unknown
      from (
        select cityId,
          cast(case when birthyear != "" then strftime('%Y', 'now') - birthyear else null end as int) as age
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
      )
      group by cityId
    ) d
    on city.id = d.cityId
)

select id,
  name,
  coalesce(data."0 - 5", 0) as "0 - 5",
  coalesce(data."6 - 12", 0) as "6 - 12",
  coalesce(data."13 - 17", 0) as "13 - 17",
  coalesce(data."18 - 24", 0) as "18 - 24",
  coalesce(data."25 - 34", 0) as "25 - 34",
  coalesce(data."35 - 54", 0) as "35 - 54",
  coalesce(data."55 - 74", 0) as "55 - 74",
  coalesce(data."75 - 84", 0) as "75 - 84",
  coalesce(data."85+", 0) as "85+",
  coalesce(data."Unknown", 0) as "Unknown"
from data
where break_out = 1
union all
select 100, 'Other KC',   sum(data."0 - 5") as "0 - 5",
  sum(data."6 - 12") as "6 - 12",
  sum(data."13 - 17") as "13 - 17",
  sum(data."18 - 24") as "18 - 24",
  sum(data."25 - 34") as "25 - 34",
  sum(data."35 - 54") as "35 - 54",
  sum(data."55 - 74") as "55 - 74",
  sum(data."75 - 84") as "75 - 84",
  sum(data."85+") as "85+",
  sum(data."Unknown") as "Unknown"
from data
where break_out = 0 and in_king_county = 1
union all
select 101, 'Outside KC', sum(data."0 - 5") as "0 - 5",
  sum(data."6 - 12") as "6 - 12",
  sum(data."13 - 17") as "13 - 17",
  sum(data."18 - 24") as "18 - 24",
  sum(data."25 - 34") as "25 - 34",
  sum(data."35 - 54") as "35 - 54",
  sum(data."55 - 74") as "55 - 74",
  sum(data."75 - 84") as "75 - 84",
  sum(data."85+") as "85+",
  sum(data."Unknown") as "Unknown"
from data
where break_out = 0 and in_king_county = 0
union all
select 102, 'Unknown', sum(data."0 - 5") as "0 - 5",
  sum(data."6 - 12") as "6 - 12",
  sum(data."13 - 17") as "13 - 17",
  sum(data."18 - 24") as "18 - 24",
  sum(data."25 - 34") as "25 - 34",
  sum(data."35 - 54") as "35 - 54",
  sum(data."55 - 74") as "55 - 74",
  sum(data."75 - 84") as "75 - 84",
  sum(data."85+") as "85+",
  sum(data."Unknown") as "Unknown"
from data
where id = 0
order by id;



