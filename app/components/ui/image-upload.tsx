"use client";

import { useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { useToast } from '../../hooks/use-toast';
import { ImageUploadService } from '../../lib/imageUpload';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string, path?: string) => void;
  onRemove?: (path?: string) => void;
  disabled?: boolean;
  folder?: string;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  folder = 'products',
  className = ''
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imagePath, setImagePath] = useState<string>('');
  const { toast } = useToast();

  const handleUpload = useCallback(async (file: File) => {
    if (disabled) return;

    // Validate file
    const validation = ImageUploadService.validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: "Invalid File",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const result = await ImageUploadService.uploadImage(file, folder);
      setImagePath(result.path);
      onChange(result.url, result.path);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : 'Failed to upload image',
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, [disabled, folder, onChange, toast]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  }, [handleUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  }, [handleUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setDragActive(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleRemove = useCallback(async () => {
    if (disabled || !value) return;

    try {
      if (imagePath) {
        // Delete from storage
        await ImageUploadService.deleteImage(imagePath);
      }
      
      setImagePath('');
      onRemove?.(imagePath);
      onChange('');
      
      toast({
        title: "Success",
        description: "Image removed successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove image",
        variant: "destructive",
      });
    }
  }, [disabled, value, imagePath, onRemove, onChange, toast]);

  return (
    <div className={`space-y-4 ${className}`}>
      {value ? (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <div className="aspect-square relative overflow-hidden rounded-lg border bg-gray-50">
                <Image
                  src={value}
                  alt="Uploaded image"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemove}
                disabled={disabled || uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2 break-all">
              {value}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div
              className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
                ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-blue-50'}
              `}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !disabled && document.getElementById('image-upload')?.click()}
            >
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={disabled || uploading}
                className="hidden"
              />
              
              <div className="flex flex-col items-center gap-4">
                {uploading ? (
                  <>
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                    <p className="text-sm text-muted-foreground">Uploading image...</p>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-blue-100 rounded-full">
                      <Upload className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium">Upload an image</p>
                      <p className="text-sm text-muted-foreground">
                        Drag and drop an image here, or click to select
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supports: JPEG, PNG, WebP, GIF (max 5MB)
                      </p>
                    </div>
                    <Button type="button" variant="outline" disabled={disabled}>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Choose Image
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
