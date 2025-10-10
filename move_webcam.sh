#!/bin/bash

# Directory locale da controllare
LOCAL_DIR="/home/meteo/ftp/files"

# Directory di destinazione
DEST_DIR="/etc/weewx/skins/sofaskin/webcam"

# Trova il file più recente nella directory
recent_file=$(ls -t "$LOCAL_DIR" | head -n 1)

# Rinomina e sposta il file (ad esempio, aggiungendo un prefisso)
new_name="webcam.jpg"
mv "$LOCAL_DIR"/"$recent_file" "$DEST_DIR"/"$new_name"

# Cancella i file più vecchi di 24 ore nella directory locale
find "$LOCAL_DIR" -type f -mmin +60 -exec rm {} \;

echo "Operazione completata con successo!"

