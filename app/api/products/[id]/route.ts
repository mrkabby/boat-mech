import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebaseAdmin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const productDoc = await adminDb.collection('products').doc(id).get();
    
    if (!productDoc.exists) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    const product = {
      id: productDoc.id,
      ...productDoc.data()
    };
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate required fields
    const { name, description, price, stock, category } = body;
    
    if (!name || !description || price === undefined || stock === undefined || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if product exists
    const productDoc = await adminDb.collection('products').doc(id).get();
    if (!productDoc.exists) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Update the product with server timestamp
    const updateData = {
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    await adminDb.collection('products').doc(id).update(updateData);
    
    return NextResponse.json({ 
      message: 'Product updated successfully',
      id 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if product exists
    const productDoc = await adminDb.collection('products').doc(id).get();
    if (!productDoc.exists) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Delete the product
    await adminDb.collection('products').doc(id).delete();
    
    return NextResponse.json({ 
      message: 'Product deleted successfully',
      id 
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
