#!/usr/bin/env python3
"""
Migrate CSV files from Google Drive to Cloud Storage
"""

import io
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from google.cloud import storage

# Configuration
DRIVE_KEY_FILE = 'sa-key-full.json'
DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive']
GCS_BUCKET_NAME = 'jobs-data-linkedin-csv-exports'  # Change this to your bucket name
GCS_PROJECT = 'jobs-data-linkedin'

def migrate_csvs_to_gcs(dry_run=True):
    """Migrate CSV files from Drive to Cloud Storage"""
    
    print("=" * 80)
    print("📦 MIGRATE CSV FILES: Google Drive → Cloud Storage")
    print("=" * 80)
    
    if dry_run:
        print("\n⚠️  DRY RUN MODE - No files will be moved")
    else:
        print("\n🔴 LIVE MODE - Files WILL be moved!")
    
    try:
        # Authenticate with Drive
        print("\n[1/5] 🔐 Authenticating with Google Drive...")
        drive_creds = service_account.Credentials.from_service_account_file(
            DRIVE_KEY_FILE, scopes=DRIVE_SCOPES
        )
        drive_service = build('drive', 'v3', credentials=drive_creds)
        print("     ✅ Drive authenticated")
        
        # Authenticate with Cloud Storage
        print("\n[2/5] 🔐 Authenticating with Cloud Storage...")
        storage_client = storage.Client(project=GCS_PROJECT)
        
        # Check if bucket exists, create if not
        try:
            bucket = storage_client.get_bucket(GCS_BUCKET_NAME)
            print(f"     ✅ Using existing bucket: {GCS_BUCKET_NAME}")
        except:
            if not dry_run:
                bucket = storage_client.create_bucket(GCS_BUCKET_NAME, location='us-central1')
                print(f"     ✅ Created new bucket: {GCS_BUCKET_NAME}")
            else:
                print(f"     ⚠️  Bucket doesn't exist. Would create: {GCS_BUCKET_NAME}")
                bucket = None
        
    except Exception as e:
        print(f"     ❌ Authentication failed: {e}")
        return
    
    try:
        # List CSV files in Drive
        print("\n[3/5] 📁 Finding CSV files in Drive...")
        results = drive_service.files().list(
            pageSize=1000,
            q="mimeType='text/csv' or name contains '.csv'",
            fields="files(id,name,size,createdTime)"
        ).execute()
        
        files = results.get('files', [])
        total_size = sum(int(f.get('size', 0)) for f in files)
        total_gb = total_size / (1024**3)
        
        print(f"     Found {len(files)} CSV files ({total_gb:.2f} GB)")
        
        if not files:
            print("     ✅ No CSV files to migrate!")
            return
        
    except Exception as e:
        print(f"     ❌ Failed to list files: {e}")
        return
    
    # Migrate files
    print(f"\n[4/5] 🚀 Migrating files to Cloud Storage...")
    
    if dry_run:
        print(f"     ⚠️  DRY RUN - Would migrate {len(files)} files ({total_gb:.2f} GB)")
        print(f"     Estimated monthly cost: ${total_gb * 0.02:.2f}")
        
        print(f"\n     Files to migrate (first 10):")
        for f in files[:10]:
            size_mb = int(f.get('size', 0)) / (1024**2)
            print(f"        • {size_mb:7.2f} MB - {f['name']}")
        
        if len(files) > 10:
            print(f"        ... and {len(files) - 10} more files")
        
        print(f"\n     To actually migrate, run:")
        print(f"     python3 migrate_csvs_to_gcs.py --migrate")
        
    else:
        migrated = 0
        failed = 0
        
        for i, file in enumerate(files, 1):
            try:
                file_id = file['id']
                file_name = file['name']
                
                # Download from Drive
                request = drive_service.files().get_media(fileId=file_id)
                file_data = io.BytesIO()
                downloader = MediaIoBaseDownload(file_data, request)
                
                done = False
                while not done:
                    status, done = downloader.next_chunk()
                
                # Upload to Cloud Storage
                file_data.seek(0)
                blob = bucket.blob(f"csv-exports/{file_name}")
                blob.upload_from_file(file_data, content_type='text/csv')
                
                # Delete from Drive
                drive_service.files().delete(fileId=file_id).execute()
                
                migrated += 1
                if migrated % 5 == 0:
                    print(f"        Migrated {migrated}/{len(files)} files...")
                
            except Exception as e:
                print(f"        ❌ Failed to migrate {file.get('name')}: {e}")
                failed += 1
        
        print(f"\n     ✅ Migrated {migrated} files")
        if failed > 0:
            print(f"     ❌ Failed to migrate {failed} files")
        print(f"     💾 Freed approximately {total_gb:.2f} GB from Drive")
        print(f"     💰 New monthly cost: ${total_gb * 0.02:.2f}")
    
    # Summary
    print("\n[5/5] 📊 Summary...")
    print(f"     Drive storage freed: {total_gb:.2f} GB")
    print(f"     Cloud Storage cost: ${total_gb * 0.02:.2f}/month")
    print(f"     Files in Cloud Storage: gs://{GCS_BUCKET_NAME}/csv-exports/")
    
    print("\n" + "=" * 80)

if __name__ == "__main__":
    import sys
    
    migrate_mode = '--migrate' in sys.argv or '--live' in sys.argv
    migrate_csvs_to_gcs(dry_run=not migrate_mode)

