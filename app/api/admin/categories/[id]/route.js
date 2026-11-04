import { NextResponse } from 'next/server';
import { deleteCategory } from '@/lib/data-source';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function DELETE(request, { params }) {
  try {
    const user = getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await deleteCategory(id);

    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete category' }, { status: 500 });
  }
}
