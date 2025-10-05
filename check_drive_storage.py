#!/usr/bin/env python3
"""
Check Google Drive storage usage for service account
"""

import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

KEY_FILE = 'sa-key-full.json'
SCOPES = ['https://www.googleapis.com/auth/drive']

def check_storage():
    """Check Drive storage usage"""
    
    print("=" * 80)
    print("💾 GOOGLE DRIVE STORAGE DIAGNOSTIC")
    print("=" * 80)
    
    try:
        # Authenticate
        print("\n[1/3] 🔐 Authenticating...")
        credentials = service_account.Credentials.from_service_account_file(
            KEY_FILE, scopes=SCOPES
        )
        drive_service = build('drive', 'v3', credentials=credentials)
        print(f"     ✅ Authenticated as: {credentials.service_account_email}")
        
    except Exception as e:
        print(f"     ❌ Authentication failed: {e}")
        return
    
    try:
        # Get storage quota
        print("\n[2/3] 📊 Checking storage quota...")
        about = drive_service.about().get(fields='storageQuota,user').execute()
        
        quota = about.get('storageQuota', {})
        limit = int(quota.get('limit', 0))
        usage = int(quota.get('usage', 0))
        usage_in_drive = int(quota.get('usageInDrive', 0))
        usage_in_trash = int(quota.get('usageInDriveTrash', 0))
        
        # Convert to GB
        limit_gb = limit / (1024**3)
        usage_gb = usage / (1024**3)
        drive_gb = usage_in_drive / (1024**3)
        trash_gb = usage_in_trash / (1024**3)
        available_gb = (limit - usage) / (1024**3)
        percent_used = (usage / limit * 100) if limit > 0 else 0
        
        print(f"\n     📦 Storage Quota:")
        print(f"        Total Limit:     {limit_gb:.2f} GB")
        print(f"        Used:            {usage_gb:.2f} GB ({percent_used:.1f}%)")
        print(f"        In Drive:        {drive_gb:.2f} GB")
        print(f"        In Trash:        {trash_gb:.2f} GB")
        print(f"        Available:       {available_gb:.2f} GB")
        
        if percent_used > 95:
            print(f"\n     🔴 CRITICAL: Storage is {percent_used:.1f}% full!")
            print(f"        This is why you're getting 403 errors!")
        elif percent_used > 80:
            print(f"\n     ⚠️  WARNING: Storage is {percent_used:.1f}% full")
        else:
            print(f"\n     ✅ Storage usage is healthy")
        
    except HttpError as e:
        print(f"     ❌ Failed to get storage info: {e}")
        return
    
    try:
        # List files
        print("\n[3/3] 📁 Analyzing files...")
        
        # Get all files
        results = drive_service.files().list(
            pageSize=1000,
            fields="files(id,name,mimeType,size,createdTime,modifiedTime,trashed)",
            orderBy="quotaBytesUsed desc"
        ).execute()
        
        files = results.get('files', [])
        
        # Categorize files
        docs = [f for f in files if f.get('mimeType') == 'application/vnd.google-apps.document' and not f.get('trashed')]
        sheets = [f for f in files if f.get('mimeType') == 'application/vnd.google-apps.spreadsheet' and not f.get('trashed')]
        other = [f for f in files if f.get('mimeType') not in ['application/vnd.google-apps.document', 'application/vnd.google-apps.spreadsheet'] and not f.get('trashed')]
        trashed = [f for f in files if f.get('trashed')]
        
        print(f"\n     📊 File Breakdown:")
        print(f"        Google Docs:     {len(docs):,} files")
        print(f"        Google Sheets:   {len(sheets):,} files")
        print(f"        Other files:     {len(other):,} files")
        print(f"        In Trash:        {len(trashed):,} files")
        print(f"        TOTAL:           {len(files):,} files")
        
        # Show largest files
        if other:
            print(f"\n     📦 Largest files (non-Docs/Sheets):")
            sorted_files = sorted(other, key=lambda x: int(x.get('size', 0)), reverse=True)[:10]
            for f in sorted_files:
                size = int(f.get('size', 0))
                size_mb = size / (1024**2)
                name = f.get('name', 'Unknown')[:50]
                print(f"        • {size_mb:.2f} MB - {name}")
        
        # Recommendations
        print("\n" + "=" * 80)
        print("💡 RECOMMENDATIONS:")
        print("=" * 80)
        
        if percent_used > 95:
            print("\n🔴 URGENT: You need to free up space immediately!")
            print("\nOptions:")
            print(f"1. Empty trash ({len(trashed):,} files) - Could free up {trash_gb:.2f} GB")
            print(f"2. Delete old documents ({len(docs):,} docs)")
            print(f"3. Delete old spreadsheets ({len(sheets):,} sheets)")
            print("4. Move files to a different storage location")
            print("5. Upgrade to Google Workspace (more storage)")
            print("\nWould you like me to:")
            print("• Empty the trash?")
            print("• List documents older than X days for deletion?")
            print("• Move files to a different service account?")
        
    except Exception as e:
        print(f"     ⚠️  Couldn't analyze files: {e}")
    
    print("\n" + "=" * 80)

if __name__ == "__main__":
    check_storage()

