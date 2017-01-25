dateStr=`date -Idate`


function compressFile {
  filename=$1
  compressedFilename=$2

  if [ -e $filename ] && [ ! -e $compressedFilename ]; then
    echo "compressing $filename"
    p7zip $filename
  fi
}

function dumpDatabase {
  dumpFilename="/home/charlie/backup/backups/$dateStr.dump"
  compressedFilename="$dumpFilename.7z"

  if [ ! -e $dumpFilename ] && [ ! -e $compressedFilename ]; then
    echo "dumping database";
    sqlite3 ~/github/rfb-client-app/database.sqlite .dump > "$dumpFilename";
  fi

  compressFile $dumpFilename $compressedFilename
}

dumpDatabase

python /home/charlie/backup/uploadBackup.py
