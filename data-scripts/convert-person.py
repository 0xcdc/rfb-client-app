import json
import csv
import subprocess
cmd = 'mdb-export rfb.accdb Person'

csvrecords = subprocess.check_output(cmd, shell=True)
personreader = csv.reader(csvrecords.split("\n"))

keys = personreader.next()
keys = ["personId", "householdId", "firstName", "lastName", "disabled", "race", "birthYear", "gender",
        "refugeeImmigrantStatus", "speaksEnglish", "militaryStatus", "dateEntered", "enteredBy", "personNote"]
data = []

races = {
        ""  : "Unknown",
        "1" : "Indian-American or Alaskan-Native",
        "2" : "Asian, Asian-American",
        "3" : "Black, African-American, Other African",
        "4" : "Latino, Latino American, Hispanic",
        "5" : "Hawaiian-Native or Pacific Islander",
        "6" : "White or Caucasian",
        "7" : "Other Race",
        "8" : "Multi-Racial (2+ identified)",
        }

militaryService = {
        "None" : "None",
        "Partners of active military" : "Partners of persons with active military service",
        "Partners of persons with active military service" : "Partners of persons with active military service",
        "Spouse of Active Military" : "Partners of persons with active military service",
        "US Military (past or present)" : "US Military Service (past or present)",
        "US Military Service (past or present)" : "US Military Service (past or present)",
        "US Past or Present" : "US Military Service (past or present)",
        }

for row in personreader:
    kv = dict(zip(keys, row))

    if(len(kv) > 0):
        #some of the race fields are integers and other are strings.  we want to normalize on strings
        if(kv["race"] in races):
            kv["race"] = races[kv["race"]]

        if(kv["birthYear"] == "0"):
            kv["birthYear"] = "";

        if(kv["birthYear"] != "" and int(kv["birthYear"]) < 100):
            kv["birthYear"] = str(1900 + int(kv["birthYear"]));

        if(kv["gender"] == "Trans"):
            kv["gender"] = "Transgendered"

        if(kv["militaryStatus"] in militaryService):
            kv["militaryStatus"] = militaryService[kv["militaryStatus"]]
        else:
            kv["militaryStatus"] = ""

        data.append(kv)

print json.dumps(data, indent = 2)

