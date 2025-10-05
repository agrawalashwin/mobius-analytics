#!/usr/bin/env python3
"""
Simple test script to verify service account can create Google Docs
Uses service account key file directly
"""

import json
import sys
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Required scopes
SCOPES = [
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file'
]

# Service account key file
KEY_FILE = 'sa-key-full.json'

def test_create_doc():
    """Test if we can create a Google Doc"""

    print("=" * 80)
    print("🔍 GOOGLE DOCS API TEST")
    print("=" * 80)

    try:
        # Get credentials from key file
        print("\n[1/4] 🔐 Getting credentials from key file...")

        if not os.path.exists(KEY_FILE):
            print(f"     ❌ Key file not found: {KEY_FILE}")
            return False

        credentials = service_account.Credentials.from_service_account_file(
            KEY_FILE,
            scopes=SCOPES
        )

        print(f"     ✅ Authenticated successfully!")
        print(f"     📧 Service Account: {credentials.service_account_email}")

    except Exception as e:
        print(f"     ❌ Authentication failed: {e}")
        return False
    
    try:
        # Build services
        print("\n[2/4] 🔨 Building API services...")
        docs_service = build('docs', 'v1', credentials=credentials)
        drive_service = build('drive', 'v3', credentials=credentials)
        print("     ✅ Services created!")
        
    except Exception as e:
        print(f"     ❌ Failed to build services: {e}")
        return False
    
    try:
        # Create document
        print("\n[3/4] 📄 Creating test document...")
        document = {
            'title': 'TEST - Service Account Diagnostic - DELETE ME'
        }
        
        doc = docs_service.documents().create(body=document).execute()
        doc_id = doc.get('documentId')
        doc_url = f"https://docs.google.com/document/d/{doc_id}/edit"
        
        print(f"     ✅ Document created!")
        print(f"     📄 Document ID: {doc_id}")
        print(f"     🔗 URL: {doc_url}")
        
    except HttpError as e:
        error_details = json.loads(e.content.decode('utf-8'))
        print(f"     ❌ Failed to create document!")
        print(f"     🚨 HTTP {e.resp.status}: {e.reason}")
        print(f"     📋 Details: {json.dumps(error_details, indent=2)}")
        
        if e.resp.status == 403:
            print("\n" + "=" * 80)
            print("🔴 PERMISSION DENIED (403)")
            print("=" * 80)
            print("\nThis means:")
            print("❌ The service account CANNOT create Google Docs")
            print("\nPossible causes:")
            print("1. Google Docs API not enabled")
            print("2. Service account lacks domain-wide delegation")
            print("3. Google Workspace admin blocked service account")
            print("4. Organizational policy restricting API access")
            print("=" * 80)
        
        return False
    
    except Exception as e:
        print(f"     ❌ Unexpected error: {e}")
        return False
    
    try:
        # Write content
        print("\n[4/4] ✏️  Writing content...")
        requests = [
            {
                'insertText': {
                    'location': {'index': 1},
                    'text': 'Service account test successful!\n\nYou can delete this document.'
                }
            }
        ]
        
        docs_service.documents().batchUpdate(
            documentId=doc_id,
            body={'requests': requests}
        ).execute()
        
        print(f"     ✅ Content written!")
        
    except Exception as e:
        print(f"     ⚠️  Couldn't write content: {e}")
    
    # Success!
    print("\n" + "=" * 80)
    print("✅ SUCCESS! Service account can create Google Docs")
    print("=" * 80)
    print(f"\n🔗 Test document: {doc_url}")
    print("\n💡 You can delete this test document")
    print("=" * 80)
    
    return True

if __name__ == "__main__":
    success = test_create_doc()
    sys.exit(0 if success else 1)

