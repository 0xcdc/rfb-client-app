import json
import datetime

firstNames = [
        "Able", "Ben", "Charlie", "Darian", "Elle", "Fanny", "Gretchen", "Harold", "Indie", "Jack", "Kelly", "Laurie",
        "Mickey", "Noah", "Oprah", "Penelope", "Quentin", "Russell", "Steve", "Tina", "Urckle", "Vicky", "Wendy", "Xu",
        "Ying", "Zed"
        ]

lastNames = [
        "Arron", "Baker", "Cook", "Delong", "Esparanza", "Fitz", "Gage", "Heron", "Iggy", "Jeffers", "Klein", "Lomax",
        "Mouse", "Nice", "Orange", "Phelps", "Qi", "Raleigh", "Savage", "Thunder", "Usted", "Vick", "Wild", "Xu", "Yi",
        "Zevo"
        ]

races = [
        "Unknown",
        "Indian-American or Alaskan-Native",
        "Asian, Asian-American",
        "Black, African-American, Other African",
        "Latino, Latino American, Hispanic",
        "Hawaiian-Native or Pacific Islander",
        "White or Caucasian",
        "Other Race",
        "Multi-Racial (2+ identified)",
        ]

militaryService = [
        "None",
        "Partners of persons with active military service",
        "US Military Service (past or present)",
        ]

ethnicity = [
        "Hispanic, Latino",
        "Other",
        ]

gender = [
        "Male",
        "Female",
        "Transgendered"
        ]
income = [
         "<$24,000",
         "$24,000 - <$40,000",
         "$40,000 - <$64,000",
         ">$64,000",
         ]


personId = 0;
householdId = 0;

persons = []
households = []
visits = []

while householdId <= len(lastNames):
    household = {}
    household["householdId"] = householdId
    household["address1"] = "100 Some Street"
    household["address2"] = ""
    household["city"] = "Bellevue"
    household["state"] = "WA"
    household["zip"] = "98008"
    household["income"] = income[householdId % len(income)]
    household["note"] = ""
    household["oldHouseholdId"] = ""
    household["dateEntered"] = ""
    household["enteredBy"] = ""

    households.append(household)

    householdSize = householdId % 8 + 1;
    while householdSize > 0:
        person = {};

        person["personId"] = personId
        person["householdId"] = householdId
        person["firstName"] = firstNames[personId % len(firstNames)]
        person["lastName"] = lastNames[householdId % len(lastNames)]
        person["disabled"] = personId % 2
        person["race"] = races[personId % len(races)]
        person["birthYear"] = 2016 - (householdId % 100)
        person["gender"] = gender[personId % len(gender)]
        person["refugeeImmigrantStatus"] = personId % 2
        person["limitedEnglishProficiency"] = personId % 2
        person["militaryStatus"] = militaryService[personId % len(militaryService)]
        person["dateEntered"] = "1/1/2016"
        person["enteredBy"] = "dummy data"
        person["ethnicity"] = ethnicity[personId % len(ethnicity)]

        persons.append(person)
        personId = personId + 1
        householdSize = householdSize - 1

    visitCount = householdId % 8 + 1
    currentDate = datetime.date(2016, 10, 17)
    while visitCount > 0:
        visit = {}
        visit["householdId"] = householdId
        visit["date"] = currentDate.isoformat()
        currentDate = currentDate - datetime.timedelta(weeks = 1)
        visitCount = visitCount - 1
        visits.append(visit)

    householdId = householdId + 1

allData = {
        "persons": persons,
        "households": households,
        "visits": visits,
        }
print json.dumps(allData, indent = 2)
