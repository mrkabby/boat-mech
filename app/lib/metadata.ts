// app/lib/metadata.ts
import type { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  title: {
    default: 'Boat Mech - Your Marine Parts Expert',
    template: '%s | Boat Mech'
  },
  description: 'Find all your boat parts and accessories at Boat Mech. High-quality marine equipment, expert advice, and fast shipping.',
  keywords: ['boat parts', 'marine equipment', 'boat accessories', 'marine supplies'],
  authors: [{ name: 'Boat Mech Team' }],
  creator: 'Boat Mech',
  publisher: 'Boat Mech',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://boat-mech.com',
    siteName: 'Boat Mech',
    title: 'Boat Mech - Your Marine Parts Expert',
    description: 'Find all your boat parts and accessories at Boat Mech.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Boat Mech - Marine Parts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@boatmech',
    creator: '@boatmech',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const generateProductMetadata = (product: {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}): Metadata => ({
  title: product.name,
  description: product.description,
  openGraph: {
    title: product.name,
    description: product.description,
    images: [product.imageUrl],
    type: 'website', // Fixed: changed from 'product' to 'website'
  },
  alternates: {
    canonical: `/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`,
  },
});
