#!/usr/bin/env python3
"""
Test Domain-Wide Delegation for service account
"""

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

KEY_FILE = 'sa-key-full.json'
SCOPES = [
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file'
]

# The user to impersonate (must be in your Workspace domain)
DELEGATED_USER = 'ashwin@mobiusengine.ai'  # Change this to your Workspace user

def test_domain_wide_delegation():
    """Test if domain-wide delegation is working"""
    
    print("=" * 80)
    print("🔑 DOMAIN-WIDE DELEGATION TEST")
    print("=" * 80)
    
    try:
        print("\n[1/3] 🔐 Creating delegated credentials...")
        
        # Load service account credentials
        credentials = service_account.Credentials.from_service_account_file(
            KEY_FILE,
            scopes=SCOPES
        )
        
        # Create delegated credentials (impersonate user)
        delegated_credentials = credentials.with_subject(DELEGATED_USER)
        
        print(f"     ✅ Service Account: {credentials.service_account_email}")
        print(f"     👤 Impersonating: {DELEGATED_USER}")
        
    except Exception as e:
        print(f"     ❌ Failed to create credentials: {e}")
        return False
    
    try:
        print("\n[2/3] 🔨 Building Google Docs API service...")
        docs_service = build('docs', 'v1', credentials=delegated_credentials)
        drive_service = build('drive', 'v3', credentials=delegated_credentials)
        print("     ✅ Services created!")
        
    except Exception as e:
        print(f"     ❌ Failed to build services: {e}")
        return False
    
    try:
        print("\n[3/3] 📄 Creating test document...")
        
        document = {
            'title': 'TEST - Domain-Wide Delegation - DELETE ME'
        }
        
        doc = docs_service.documents().create(body=document).execute()
        doc_id = doc.get('documentId')
        doc_url = f"https://docs.google.com/document/d/{doc_id}/edit"
        
        print(f"     ✅ Document created!")
        print(f"     📄 Document ID: {doc_id}")
        print(f"     🔗 URL: {doc_url}")
        
        # Check ownership
        file_info = drive_service.files().get(
            fileId=doc_id,
            fields='owners,permissions'
        ).execute()
        
        owners = file_info.get('owners', [])
        if owners:
            owner_email = owners[0].get('emailAddress')
            print(f"     👤 Document owner: {owner_email}")
            
            if owner_email == DELEGATED_USER:
                print(f"     ✅ Document is owned by the Workspace user!")
                print(f"     ✅ This means the user has UNLIMITED storage!")
            else:
                print(f"     ⚠️  Document is owned by: {owner_email}")
        
    except HttpError as e:
        print(f"     ❌ Failed to create document!")
        print(f"     🚨 HTTP {e.resp.status}: {e.reason}")
        
        if e.resp.status == 403:
            print("\n" + "=" * 80)
            print("🔴 DOMAIN-WIDE DELEGATION NOT CONFIGURED")
            print("=" * 80)
            print("\nThis means:")
            print("❌ The service account is NOT authorized in Google Workspace")
            print("\nTo fix:")
            print("1. Go to: https://admin.google.com/ac/owl/domainwidedelegation")
            print("2. Add Client ID: 117156236309964619177")
            print("3. Add scopes:")
            print("   - https://www.googleapis.com/auth/documents")
            print("   - https://www.googleapis.com/auth/drive")
            print("   - https://www.googleapis.com/auth/drive.file")
            print("4. Click 'Authorize'")
            print("=" * 80)
        
        return False
    
    except Exception as e:
        print(f"     ❌ Unexpected error: {e}")
        return False
    
    print("\n" + "=" * 80)
    print("✅ DOMAIN-WIDE DELEGATION IS WORKING!")
    print("=" * 80)
    print("\n🎉 Benefits:")
    print("   ✅ Documents are owned by Workspace users")
    print("   ✅ Uses Workspace storage quota (not service account's 15 GB)")
    print("   ✅ Documents appear in user's Drive")
    print("   ✅ Better sharing and permissions management")
    print("\n🔗 Test document: " + doc_url)
    print("=" * 80)
    
    return True

if __name__ == "__main__":
    import sys
    success = test_domain_wide_delegation()
    sys.exit(0 if success else 1)

