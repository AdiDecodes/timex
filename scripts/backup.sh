#!/bin/sh

# Automated Backup Script for Timex Ceramic Relational DB
BACKUP_DIR="/var/backups/timex-ceramic"
DATE=$(date +%Y-%m-%d_%H%M%S)
DB_NAME=${DATABASE_NAME:-"timex_ceramic"}
DB_USER=${DATABASE_USER:-"root"}
DB_PASS=${DATABASE_PASSWORD:-"password"}

mkdir -p "$BACKUP_DIR"

echo "Starting database backup for $DB_NAME..."

# Execute mysqldump
mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$BACKUP_DIR/db_backup_$DATE.sql"

if [ $? -eq 0 ]; then
  # Compress backup file
  tar -czf "$BACKUP_DIR/db_backup_$DATE.tar.gz" -C "$BACKUP_DIR" "db_backup_$DATE.sql"
  rm "$BACKUP_DIR/db_backup_$DATE.sql"
  echo "Backup successfully completed: db_backup_$DATE.tar.gz"
  
  # Prune backups older than 30 days
  find "$BACKUP_DIR" -type f -name "*.tar.gz" -mtime +30 -exec rm {} \;
  echo "Purged backups older than 30 days."
else
  echo "Database backup failed!"
  exit 1
fi
