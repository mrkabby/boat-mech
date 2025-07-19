# Cloudinary Setup Instructions

## 1. Create a Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com) and sign up for a free account
2. Once logged in, go to your Dashboard

## 2. Get Your Credentials
From your Cloudinary Dashboard, copy the following values:
- **Cloud Name**: Found in the "Account Details" section
- **API Key**: Found in the "Account Details" section  
- **API Secret**: Found in the "Account Details" section (click the eye icon to reveal)

## 3. Update Environment Variables
In your `.env.local` file, replace the placeholder values with your actual Cloudinary credentials:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
CLOUDINARY_API_KEY=your-actual-api-key
CLOUDINARY_API_SECRET=your-actual-api-secret
```

## 4. Restart Your Development Server
After updating the environment variables, restart your Next.js development server:

```bash
npm run dev
```

## Features Included

### Image Upload
- Drag and drop image upload
- File size limit: 5MB
- Supported formats: PNG, JPG, GIF
- Automatic image optimization (800x600 max, auto quality, auto format)
- Images are stored in `boat-mech/products/` folder on Cloudinary

### Integration
- **Firebase**: Stores product details (name, price, description, etc.)
- **Cloudinary**: Stores and optimizes product images
- **Database**: Only stores the Cloudinary image URL and public ID

### Benefits
- Faster image loading with Cloudinary's CDN
- Automatic image optimization and format conversion
- Better performance compared to Firebase Storage
- Professional image transformations available

## Usage
1. In the admin panel, go to "Add Product"
2. Fill in product details
3. Upload an image by clicking the upload area or dragging and dropping
4. The image will be automatically uploaded to Cloudinary
5. The product details (including the Cloudinary image URL) will be saved to Firebase

## Troubleshooting
- Make sure all environment variables are set correctly
- Restart the development server after updating `.env.local`
- Check the browser console for any error messages
- Verify your Cloudinary account has sufficient upload quota
