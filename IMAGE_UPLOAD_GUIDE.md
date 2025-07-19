# Image Upload Setup Guide

## 🖼️ Firebase Storage Configuration

### Step 1: Enable Firebase Storage
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `boatmech-21554`
3. Go to **Storage** in the left sidebar
4. Click **Get started**
5. Choose your storage location (same as Firestore for best performance)

### Step 2: Deploy Storage Security Rules
1. **Using Firebase Console (Recommended):**
   - Go to Storage → Rules tab
   - Copy the content from `storage.rules`
   - Paste it into the rules editor
   - Click **Publish**

2. **Using Firebase CLI:**
   ```bash
   firebase deploy --only storage
   ```

### Step 3: Configure CORS (if needed)
If you encounter CORS issues, create a `cors.json` file:
```json
[
  {
    "origin": ["http://localhost:3000", "http://localhost:3002", "http://localhost:3003"],
    "method": ["GET", "PUT", "POST", "DELETE"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type"]
  }
]
```

Then apply it:
```bash
gsutil cors set cors.json gs://your-bucket-name.appspot.com
```

## 🚀 New Image Upload Features

### ✅ What's Implemented:

1. **Image Upload Component** (`/components/ui/image-upload.tsx`)
   - Drag & drop functionality
   - File validation (type, size)
   - Real-time upload progress
   - Image preview
   - Remove/replace images

2. **Firebase Storage Integration** (`/lib/imageUpload.ts`)
   - Automatic file naming with timestamps
   - 5MB file size limit
   - Support for JPEG, PNG, WebP, GIF
   - Storage path tracking for cleanup

3. **Updated Product Form**
   - Replaced URL input with image upload
   - Automatic storage path tracking
   - Form validation integration

4. **Security Rules**
   - Admin-only upload permissions
   - File size and type validation
   - Public read access for images

### 🎯 How to Use:

1. **Adding a Product with Image:**
   - Go to `/admin/products/new`
   - Fill in product details
   - Drag & drop or click to upload image
   - Submit the form

2. **Image Management:**
   - Images are stored in Firebase Storage under `/products/`
   - URLs are saved in the product document
   - Storage paths are tracked for cleanup

### 🔧 Testing the Implementation:

1. **Test Image Upload:**
   ```bash
   # Navigate to admin panel
   http://localhost:3000/admin/products/new
   
   # Try uploading different file types:
   # ✅ JPEG, PNG, WebP, GIF
   # ❌ PDF, TXT, MP4 (should show error)
   
   # Try large files:
   # ❌ Files > 5MB (should show error)
   ```

2. **Test Permission:**
   - Login as admin user
   - Try uploading (should work)
   - Login as regular user
   - Try uploading (should fail with permission error)

### 📊 File Organization:

```
Firebase Storage:
├── products/
│   ├── 1735123456_abc123.jpg
│   ├── 1735123789_def456.png
│   └── ...
└── users/ (for future profile images)
    └── {userId}/
        └── avatar.jpg
```

### 🛠️ Configuration Files Updated:

- ✅ `app/firebase.ts` - Added storage import
- ✅ `app/types/index.ts` - Added imagePath field
- ✅ `app/components/admin/ProductForm.tsx` - Updated with image upload
- ✅ `app/lib/imageUpload.ts` - New service for uploads
- ✅ `app/components/ui/image-upload.tsx` - New upload component
- ✅ `storage.rules` - Security rules for Firebase Storage
- ✅ `next.config.ts` - Added Firebase Storage to allowed image domains

### 🚨 Troubleshooting:

1. **"Permission denied" errors:**
   - Ensure user has admin role
   - Check if storage rules are deployed
   - Verify Firebase Storage is enabled

2. **CORS errors:**
   - Deploy CORS configuration
   - Check allowed origins in rules

3. **Large file uploads failing:**
   - Check file size (max 5MB)
   - Verify file type is supported

4. **Images not displaying:**
   - Check if firebasestorage.googleapis.com is in next.config.ts
   - Verify storage rules allow read access

### 🔄 Migration Notes:

- Existing products with URL images will continue to work
- New products will use Firebase Storage
- Both imagePath and imageUrl are stored for flexibility
- Old images can be migrated to Firebase Storage if needed

The image upload system is now fully functional and ready for production use! 🎉
