import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export interface ImageUploadResult {
  url: string;
  path: string;
}

export class ImageUploadService {
  private static generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    return `products/${timestamp}_${randomString}.${extension}`;
  }

  static async uploadImage(file: File, folder: string = 'products'): Promise<ImageUploadResult> {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }

      // Generate unique filename
      const fileName = this.generateFileName(file.name);
      const imagePath = `${folder}/${fileName}`;

      // Create storage reference
      const imageRef = ref(storage, imagePath);

      // Upload file
      const snapshot = await uploadBytes(imageRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        url: downloadURL,
        path: imagePath
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to upload image');
    }
  }

  static async deleteImage(imagePath: string): Promise<void> {
    try {
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }

  static async replaceImage(oldImagePath: string, newFile: File, folder: string = 'products'): Promise<ImageUploadResult> {
    try {
      // Upload new image first
      const newImageResult = await this.uploadImage(newFile, folder);

      // Delete old image (don't await to avoid blocking)
      this.deleteImage(oldImagePath).catch(console.error);

      return newImageResult;
    } catch (error) {
      console.error('Error replacing image:', error);
      throw error;
    }
  }

  static validateImageFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { isValid: false, error: 'File must be an image' };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 5MB' };
    }

    // Check image dimensions (optional)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Only JPEG, PNG, WebP, and GIF images are allowed' };
    }

    return { isValid: true };
  }
}
