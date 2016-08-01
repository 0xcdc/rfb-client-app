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

for row in personreader:
    kv = dict(zip(keys, row))

    if(len(kv) > 0):
        #some of the race fields are integers and other are strings.  we want to normalize on strings
        if(kv["race"] in races):
            kv["race"] = races[kv["race"]]

        data.append(kv)

print json.dumps(data, indent = 2)

