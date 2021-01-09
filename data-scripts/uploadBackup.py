from pydrive.drive import GoogleDrive
from pydrive.auth import GoogleAuth
import os
from os import listdir
from os.path import isfile, join
from datetime import date, timedelta

gauth = GoogleAuth()
gauth.CommandLineAuth()


def createBackupFolder():
  folder_metadata = {
    'title' : 'backups',
    # The mimetype defines this new file as a folder, so don't change this.
    'mimeType' : 'application/vnd.google-apps.folder'
  }
  folder = drive.CreateFile(folder_metadata)
  folder.Upload()
  return folder['id']

def getBackupFolderId():
  file_list = drive.ListFile({'q': "'root' in parents and trashed=false"}).GetList()
  for f in file_list:
    if(f['title'] == "backups"):
      return f['id']
  return ""


def getCloudFileIds(folderId):
  filenames = {}
  file_list = drive.ListFile({'q': "'" + folderId + "' in parents and trashed=false"}).GetList()
  for f in file_list:
    filenames[f['title']] = f
  return filenames

def getDiskBackupFiles():
  mypath = 'backups'
  onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]
  return set(onlyfiles)

def getFilesForDuration(countToKeep, interval, dateStrings):
  datesToKeep = []
  minDateToKeep = date.max
  minSkip = timedelta(interval)

  while len(datesToKeep) < countToKeep  and len(dateStrings) >= 1:
    candidateDateString = dateStrings.pop()
    candidateDate = date.fromisoformat(candidateDateString)
    if(candidateDate <= minDateToKeep):
      datesToKeep.append(candidateDateString)
      minDateToKeep = candidateDate - minSkip

  return datesToKeep

def getFilesToKeep(fileNames):
  datesToKeep = [];

  #create a map of date strings to filenames
  #  date strings are always the first 10 characters
  dateStringToFiles = dict(map(lambda x: [x[:10], x], fileNames))

  #load the data strings into a sorted list
  dateStrings = sorted(dateStringToFiles.keys())

  #first, keep the a week of dialies
  dailies = getFilesForDuration(14, 1, dateStrings.copy())

  #next keep up to a 4 more files that are 7 days apart (month of weeklies)
  weeklies = getFilesForDuration(4, 7, dateStrings.copy())

  #next keep up to 12 more files that are 30 days apart (a year of monthlies)
  monthlies = getFilesForDuration(12, 30, dateStrings.copy())

  #finally keep up to 10 more files that are 365 days apart (a decade of yearlies)
  yearlies = getFilesForDuration(10, 365, dateStrings.copy())

  #map back from dates we want to filesnames we want
  datesToKeep = set(dailies + weeklies + monthlies + yearlies)
  return set([dateStringToFiles[x] for x in datesToKeep])

def pruneCloudBackups():
  global existingGDriveFiles
  filesToKeep = getFilesToKeep(existingGDriveFiles)
  filesToDelete = existingGDriveFiles - filesToKeep
  for fileToDelete in sorted(filesToDelete):
    print("deleting:  " + fileToDelete)
    f = cloudFileIds[fileToDelete]
    f.Delete()

  existingGDriveFiles = set(filesToKeep)

def pruneDiskBackups():
  global existingDiskFiles
  filesToKeep = getFilesToKeep(existingDiskFiles)
  filesToDelete = existingDiskFiles - filesToKeep
  for fileToDelete in sorted(filesToDelete):
    print("deleting:  " + fileToDelete)
    os.remove("backups/" + fileToDelete)
  existingDiskFiles = set(filesToKeep)


drive = GoogleDrive(gauth)

# Create folder.
folder_id = getBackupFolderId()
if(folder_id == ""):
  folder_id = createBackupFolder()

cloudFileIds = getCloudFileIds(folder_id);
existingGDriveFiles = set(cloudFileIds.keys())
existingDiskFiles = getDiskBackupFiles()

pruneDiskBackups()
pruneCloudBackups()

for backupfile in existingDiskFiles- existingGDriveFiles:
  print("needs saving: " + backupfile)
  newf = drive.CreateFile({'title': backupfile, "parents": [{"kind": "drive#fileLink", "id": folder_id}]})
  newf.SetContentFile("backups/" + backupfile);
  newf.Upload() # Files.insert()
  print("uploaded: " + backupfile)


