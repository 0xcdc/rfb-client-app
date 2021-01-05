from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive
from os import listdir
from os.path import isfile, join

gauth = GoogleAuth()
gauth.CommandLineAuth()

drive = GoogleDrive(gauth)

# Create folder.

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

folder_id = getBackupFolderId()
if(folder_id == ""):
    folder_id = createBackupFolder()

cloudFileIds = getCloudFileIds(folder_id);
existingGDriveFiles = set(cloudFileIds.keys())

def getFilesToKeep(fileNames):
  datesToKeep = [];

  #create a map of date strings to filenames
  #  date strings are always the first 10 characters
  dateStringToFiles = dict(map(lambda x: [x[:10], x], fileNames))

  #load the data strings into a sorted list
  dateStrings = sorted(dateStringToFiles.keys())

  #first, keep the latest 7 files no matter what (a week of dailies)
  while len(datesToKeep) < 7  and len(dateStrings) >= 1:
    datesToKeep.append(dateStrings.pop())

  #next keep up to a 30 more files that are 7 days apart (month of weeklies)
  while len(datesToKeep) < 37 and len(dateStrings) >= 7:
    for i in range(6):
      dateStrings.pop()
    datesToKeep.append(dateStrings.pop())

  #next keep up to 12 more files that are 30 days apart (a year of monthlies)
  while len(datesToKeep) < 49 and len(dateStrings) >= 12:
    for i in range(29):
      dateStrings.pop()
    datesToKeep.append(dateStrings.pop())

  #finally keep up to 10 more files that are 365 days apart (a decade of yearlies)
  while len(datesToKeep) < 59 and len(dateStrings) >= 365:
    for i in range(364):
      dateStrings.pop()
    datesToKeep.append(dateStrings.pop())

  #map back from dates we want to filesnames we want
  return [dateStringsToFiles[x] for x in datesToKeep];

def pruneCloudBackups():
  filesToKeep = getFilesToKeep(existingGDriveFiles)
  for fileToDelete in existingGDriveFiles - filesToKeep:
    print "deleting:  " + fileToDelete
#    drive.DeleteFile(cloudFileIds[fileToDelete]
  exisitngGDriveFiles = filesToKeep

pruneCloudBackups()

#backupFiles = getDiskBackupFiles()
#
#for backupfile in backupFiles - existingGDriveFiles:
#  print "needs saving: " + backupfile
#  newf = drive.CreateFile({'title': backupfile, "parents": [{"kind": "drive#fileLink", "id": folder_id}]})
#  newf.SetContentFile("backups/" + backupfile);
#  newf.Upload() # Files.insert()
#  print "uploaded: " + backupfile


