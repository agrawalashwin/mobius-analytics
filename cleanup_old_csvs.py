#!/usr/bin/env python3
"""
Delete old CSV files from Google Drive to free up space
"""

import json
from datetime import datetime, timedelta
from google.oauth2 import service_account
from googleapiclient.discovery import build

KEY_FILE = 'sa-key-full.json'
SCOPES = ['https://www.googleapis.com/auth/drive']

def cleanup_csvs(days_old=30, dry_run=True):
    """Delete CSV files older than X days"""
    
    print("=" * 80)
    print("🧹 GOOGLE DRIVE CLEANUP - CSV FILES")
    print("=" * 80)
    
    if dry_run:
        print("\n⚠️  DRY RUN MODE - No files will be deleted")
        print("    Set dry_run=False to actually delete files\n")
    else:
        print("\n🔴 LIVE MODE - Files WILL be deleted!\n")
    
    try:
        # Authenticate
        credentials = service_account.Credentials.from_service_account_file(
            KEY_FILE, scopes=SCOPES
        )
        drive_service = build('drive', 'v3', credentials=credentials)
        
        # Get all CSV files
        print(f"[1/3] 📁 Finding CSV files older than {days_old} days...")
        
        results = drive_service.files().list(
            pageSize=1000,
            q="mimeType='text/csv' or name contains '.csv'",
            fields="files(id,name,size,createdTime,modifiedTime)",
            orderBy="createdTime"
        ).execute()
        
        files = results.get('files', [])
        print(f"     Found {len(files)} CSV files")
        
        # Filter by age
        from datetime import timezone
        cutoff_date = datetime.now(timezone.utc) - timedelta(days=days_old)
        old_files = []

        for f in files:
            created = datetime.fromisoformat(f['createdTime'].replace('Z', '+00:00'))
            if created < cutoff_date:
                old_files.append(f)
        
        if not old_files:
            print(f"\n✅ No CSV files older than {days_old} days found!")
            return
        
        # Calculate space to free
        total_size = sum(int(f.get('size', 0)) for f in old_files)
        total_gb = total_size / (1024**3)
        
        print(f"\n[2/3] 📊 Files to delete:")
        print(f"     Count: {len(old_files)} files")
        print(f"     Space to free: {total_gb:.2f} GB")
        
        # Show files
        print(f"\n     Files (showing first 20):")
        for f in old_files[:20]:
            size_mb = int(f.get('size', 0)) / (1024**2)
            name = f['name'][:60]
            created = f['createdTime'][:10]
            print(f"        • {size_mb:7.2f} MB - {created} - {name}")
        
        if len(old_files) > 20:
            print(f"        ... and {len(old_files) - 20} more files")
        
        # Delete files
        print(f"\n[3/3] 🗑️  Deleting files...")
        
        if dry_run:
            print(f"     ⚠️  DRY RUN - Would delete {len(old_files)} files ({total_gb:.2f} GB)")
            print(f"\n     To actually delete, run:")
            print(f"     python3 cleanup_old_csvs.py --delete")
        else:
            deleted = 0
            failed = 0
            
            for f in old_files:
                try:
                    drive_service.files().delete(fileId=f['id']).execute()
                    deleted += 1
                    if deleted % 10 == 0:
                        print(f"        Deleted {deleted}/{len(old_files)} files...")
                except Exception as e:
                    print(f"        ❌ Failed to delete {f['name']}: {e}")
                    failed += 1
            
            print(f"\n     ✅ Deleted {deleted} files")
            if failed > 0:
                print(f"     ❌ Failed to delete {failed} files")
            print(f"     💾 Freed approximately {total_gb:.2f} GB")
        
    except Exception as e:
        print(f"     ❌ Error: {e}")
        return
    
    print("\n" + "=" * 80)

if __name__ == "__main__":
    import sys
    
    # Check for --delete flag
    delete_mode = '--delete' in sys.argv or '--live' in sys.argv
    
    # Check for days parameter
    days = 30
    for arg in sys.argv:
        if arg.startswith('--days='):
            days = int(arg.split('=')[1])
    
    cleanup_csvs(days_old=days, dry_run=not delete_mode)

