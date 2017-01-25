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

def getCurrentBackedUpFiles(folderId):
    filenames = set()
    file_list = drive.ListFile({'q': "'" + folderId + "' in parents and trashed=false"}).GetList()
    for f in file_list:
        filenames.add(f['title'])
    return filenames

def getBackupFiles():
    mypath = 'backups'
    onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]
    return set(onlyfiles)

folder_id = getBackupFolderId()
if(folder_id == ""):
    folder_id = createBackupFolder()

existingGDriveFiles = getCurrentBackedUpFiles(folder_id)
backupFiles = getBackupFiles()

for backupfile in backupFiles - existingGDriveFiles:
    print "needs saving: " + backupfile
    newf = drive.CreateFile({'title': backupfile, "parents": [{"kind": "drive#fileLink", "id": folder_id}]})
    newf.SetContentFile("backups/" + backupfile);
    newf.Upload() # Files.insert()
    print "uploaded: " + backupfile


