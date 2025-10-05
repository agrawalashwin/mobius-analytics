# 🔑 Domain-Wide Delegation Setup Guide

## Overview
This guide will help you associate your service account with Google Workspace, allowing it to create documents that use **Workspace storage** instead of the service account's 15 GB limit.

---

## 📋 Service Account Information

**Service Account Email:**
```
dataengineer-dev@jobs-data-linkedin.iam.gserviceaccount.com
```

**OAuth2 Client ID:**
```
117156236309964619177
```

**Required OAuth Scopes:**
```
https://www.googleapis.com/auth/documents
https://www.googleapis.com/auth/drive
https://www.googleapis.com/auth/drive.file
https://www.googleapis.com/auth/spreadsheets
```

---

## 🎯 Benefits of Domain-Wide Delegation

✅ **Documents use Workspace storage** (not service account's 15 GB)  
✅ **Documents owned by Workspace users** (better permissions)  
✅ **Documents appear in user's Drive** (easier to find)  
✅ **Better sharing capabilities**  
✅ **Workspace storage quota** (30 GB - 5 TB depending on plan)

---

## 📝 Step-by-Step Instructions

### **PART 1: Enable in Google Cloud Console**

1. **Open Service Accounts page:**
   ```
   https://console.cloud.google.com/iam-admin/serviceaccounts?project=jobs-data-linkedin
   ```

2. **Find and click on:**
   ```
   dataengineer-dev@jobs-data-linkedin.iam.gserviceaccount.com
   ```

3. **Go to "Details" tab** (should be selected by default)

4. **Scroll down to "Domain-wide delegation" section**

5. **Check the box:**
   ```
   ☑️ Enable Google Workspace Domain-wide Delegation
   ```

6. **Click "Save"**

---

### **PART 2: Authorize in Google Workspace Admin Console**

1. **Open Google Workspace Admin Console:**
   ```
   https://admin.google.com/
   ```

2. **Sign in with Super Admin account:**
   ```
   ashwin@mobiusengine.ai
   ```

3. **Navigate to:**
   ```
   Security → Access and data control → API controls
   ```
   
   **Or use direct link:**
   ```
   https://admin.google.com/ac/owl/domainwidedelegation
   ```

4. **Click "Add new" button** (or "Manage Domain Wide Delegation" → "Add new")

5. **Fill in the form:**

   **Client ID:**
   ```
   117156236309964619177
   ```
   
   **OAuth Scopes** (paste all of these, one per line or comma-separated):
   ```
   https://www.googleapis.com/auth/documents,https://www.googleapis.com/auth/drive,https://www.googleapis.com/auth/drive.file,https://www.googleapis.com/auth/spreadsheets
   ```

6. **Click "Authorize"**

7. **Verify it appears in the list** with status "Authorized"

---

### **PART 3: Test the Configuration**

Run the test script:

```bash
python3 test_domain_wide_delegation.py
```

**Expected output:**
```
✅ DOMAIN-WIDE DELEGATION IS WORKING!
```

**If you see errors:**
- Wait 5-10 minutes for changes to propagate
- Verify Client ID is correct
- Verify all scopes are added
- Check you're a Super Admin in Workspace

---

## 🔍 Troubleshooting

### **Error: "The caller does not have permission" (403)**

**Cause:** Domain-wide delegation not configured in Workspace Admin Console

**Fix:**
1. Go to: https://admin.google.com/ac/owl/domainwidedelegation
2. Verify Client ID `117156236309964619177` is listed
3. Verify all scopes are added
4. Wait 5-10 minutes for propagation

---

### **Error: "Not a valid email address"**

**Cause:** The delegated user email is not in your Workspace domain

**Fix:**
1. Use a valid Workspace user email (e.g., `ashwin@mobiusengine.ai`)
2. Make sure the user exists in your Workspace

---

### **Error: "Domain not found"**

**Cause:** Your Google Cloud project is not associated with a Workspace domain

**Fix:**
1. You need a Google Workspace account
2. The service account must be in a project linked to Workspace
3. Or use a different approach (see alternatives below)

---

## 🎯 What Happens After Setup

### **Before Domain-Wide Delegation:**
- ❌ Documents created by service account
- ❌ Uses service account's 15 GB storage
- ❌ Documents owned by service account
- ❌ Hard to share and manage

### **After Domain-Wide Delegation:**
- ✅ Documents created on behalf of Workspace user
- ✅ Uses Workspace user's storage (30 GB - 5 TB)
- ✅ Documents owned by Workspace user
- ✅ Easy to share and manage
- ✅ Appears in user's Google Drive

---

## 💡 Alternative: If You Don't Have Google Workspace

If you don't have Google Workspace, you have these options:

### **Option 1: Get Google Workspace**
- Cost: $6-18/user/month
- Benefit: 30 GB - 5 TB storage per user
- Best for: Business use

### **Option 2: Use Multiple Service Accounts**
- Cost: Free
- Benefit: 15 GB per service account
- Best for: Small scale

### **Option 3: Move CSVs to Cloud Storage**
- Cost: ~$0.02/GB/month
- Benefit: Unlimited storage
- Best for: Large files that don't need Google Docs features

### **Option 4: Buy Google One**
- Cost: $1.99-9.99/month
- Benefit: 100 GB - 2 TB
- Best for: Personal accounts

---

## 📞 Need Help?

If you encounter issues:

1. **Check you're a Super Admin:**
   - Go to: https://admin.google.com/ac/users
   - Find your account
   - Verify "Super Admin" role

2. **Verify your Workspace domain:**
   - What domain do you use? (e.g., `mobiusengine.ai`)
   - Do you have Google Workspace or just Gmail?

3. **Check service account permissions:**
   ```bash
   gcloud iam service-accounts describe dataengineer-dev@jobs-data-linkedin.iam.gserviceaccount.com --project=jobs-data-linkedin
   ```

---

## ✅ Checklist

- [ ] Enabled domain-wide delegation in GCP Console
- [ ] Added Client ID to Workspace Admin Console
- [ ] Added all required OAuth scopes
- [ ] Clicked "Authorize" in Workspace Admin
- [ ] Waited 5-10 minutes for propagation
- [ ] Ran test script successfully
- [ ] Verified document is owned by Workspace user

---

## 🎉 Success Criteria

When everything is working:

1. ✅ Test script creates document successfully
2. ✅ Document is owned by Workspace user (not service account)
3. ✅ Document appears in user's Google Drive
4. ✅ No more 15 GB storage limit issues
5. ✅ Resume service works without errors

---

## 📚 Additional Resources

- **Google Workspace Admin Help:** https://support.google.com/a/answer/162106
- **Domain-Wide Delegation Guide:** https://developers.google.com/identity/protocols/oauth2/service-account#delegatingauthority
- **Service Account Documentation:** https://cloud.google.com/iam/docs/service-accounts

---

**Last Updated:** October 5, 2025

