#!/usr/bin/env python3
"""
Test script to verify service account can create Google Docs
"""

import json
import sys
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Service account email
SERVICE_ACCOUNT_EMAIL = "dataengineer-dev@jobs-data-linkedin.iam.gserviceaccount.com"

# Required scopes
SCOPES = [
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file'
]

def test_service_account():
    """Test if service account can create a Google Doc"""
    
    print("=" * 80)
    print("🔍 GOOGLE DOCS SERVICE ACCOUNT DIAGNOSTIC TEST")
    print("=" * 80)
    print(f"\n📧 Service Account: {SERVICE_ACCOUNT_EMAIL}")
    print(f"🔑 Required Scopes:")
    for scope in SCOPES:
        print(f"   - {scope}")
    print("\n" + "-" * 80)
    
    try:
        # Step 1: Get credentials using Application Default Credentials
        print("\n[1/5] 🔐 Authenticating with service account...")
        
        # Try to use application default credentials
        credentials = service_account.Credentials.from_service_account_file(
            '/dev/stdin',  # We'll pass the key via stdin
            scopes=SCOPES
        )
        
        print("     ✅ Authentication successful!")
        
    except Exception as e:
        print(f"     ❌ Authentication failed: {e}")
        print("\n💡 Trying Application Default Credentials instead...")
        
        try:
            from google.auth import default
            credentials, project = default(scopes=SCOPES)
            print(f"     ✅ Using ADC for project: {project}")
        except Exception as e2:
            print(f"     ❌ ADC also failed: {e2}")
            return False
    
    # Step 2: Build Google Docs API service
    print("\n[2/5] 🔨 Building Google Docs API service...")
    try:
        docs_service = build('docs', 'v1', credentials=credentials)
        print("     ✅ Google Docs API service created!")
    except Exception as e:
        print(f"     ❌ Failed to build Docs service: {e}")
        return False
    
    # Step 3: Build Google Drive API service
    print("\n[3/5] 🔨 Building Google Drive API service...")
    try:
        drive_service = build('drive', 'v3', credentials=credentials)
        print("     ✅ Google Drive API service created!")
    except Exception as e:
        print(f"     ❌ Failed to build Drive service: {e}")
        return False
    
    # Step 4: Try to create a test document
    print("\n[4/5] 📄 Attempting to create a test Google Doc...")
    try:
        document = {
            'title': 'TEST - Service Account Diagnostic - DELETE ME'
        }
        
        doc = docs_service.documents().create(body=document).execute()
        doc_id = doc.get('documentId')
        doc_url = f"https://docs.google.com/document/d/{doc_id}/edit"
        
        print(f"     ✅ Document created successfully!")
        print(f"     📄 Document ID: {doc_id}")
        print(f"     🔗 Document URL: {doc_url}")
        
    except HttpError as e:
        error_details = json.loads(e.content.decode('utf-8'))
        print(f"     ❌ Failed to create document!")
        print(f"     🚨 HTTP Error {e.resp.status}: {e.reason}")
        print(f"     📋 Error Details: {json.dumps(error_details, indent=2)}")
        
        if e.resp.status == 403:
            print("\n" + "=" * 80)
            print("🔴 PERMISSION DENIED (403)")
            print("=" * 80)
            print("\nPossible causes:")
            print("1. ❌ Google Docs API not enabled for the project")
            print("2. ❌ Service account lacks domain-wide delegation")
            print("3. ❌ Google Workspace admin restricted service account access")
            print("4. ❌ Service account blocked at organizational level")
            print("\nTo fix:")
            print("• Enable Google Docs API: gcloud services enable docs.googleapis.com")
            print("• Check Google Workspace Admin Console → Security → API Controls")
            print("• Verify domain-wide delegation for this service account")
            print("=" * 80)
        
        return False
    
    except Exception as e:
        print(f"     ❌ Unexpected error: {e}")
        return False
    
    # Step 5: Try to update the document
    print("\n[5/5] ✏️  Attempting to write content to the document...")
    try:
        requests = [
            {
                'insertText': {
                    'location': {
                        'index': 1,
                    },
                    'text': 'This is a test document created by the service account diagnostic script.\n\n'
                           'If you can see this, the service account has:\n'
                           '✅ Permission to create documents\n'
                           '✅ Permission to write to documents\n\n'
                           'You can safely delete this document.'
                }
            }
        ]
        
        docs_service.documents().batchUpdate(
            documentId=doc_id,
            body={'requests': requests}
        ).execute()
        
        print(f"     ✅ Content written successfully!")
        
    except HttpError as e:
        print(f"     ⚠️  Document created but couldn't write content: {e}")
    
    # Step 6: Check document permissions
    print("\n[6/6] 🔒 Checking document permissions...")
    try:
        permissions = drive_service.permissions().list(
            fileId=doc_id,
            fields='permissions(id,type,role,emailAddress)'
        ).execute()
        
        print(f"     ✅ Current permissions:")
        for perm in permissions.get('permissions', []):
            perm_type = perm.get('type', 'unknown')
            role = perm.get('role', 'unknown')
            email = perm.get('emailAddress', 'N/A')
            print(f"        • {perm_type}: {role} ({email})")
        
    except Exception as e:
        print(f"     ⚠️  Couldn't retrieve permissions: {e}")
    
    # Final summary
    print("\n" + "=" * 80)
    print("✅ TEST COMPLETED SUCCESSFULLY!")
    print("=" * 80)
    print(f"\n📄 Test document created: {doc_url}")
    print("\n🎉 The service account is working correctly!")
    print("💡 You can delete the test document from Google Drive")
    print("=" * 80)
    
    return True

if __name__ == "__main__":
    success = test_service_account()
    sys.exit(0 if success else 1)

