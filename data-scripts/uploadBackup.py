from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive

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

folder_id = getBackupFolderId()
if(folder_id == ""):
    folder_id = createBackupFolder()


# Upload file to folder.
f = drive.CreateFile({'title': 'Hello.txt', "parents": [{"kind": "drive#fileLink", "id": folder_id}]})
f.SetContentString('Hello')
f.Upload() # Files.insert()


