import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { pageContents, session } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

const VALID_PAGES = ['home', 'about', 'experience', 'menu', 'catering', 'contact'];
const VALID_CONTENT_TYPES = ['text', 'image', 'list_item'];

async function validateToken(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  
  try {
    const sessionRecord = await db
      .select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1);
    
    if (sessionRecord.length === 0) {
      return false;
    }
    
    const sessionData = sessionRecord[0];
    if (new Date(sessionData.expiresAt) < new Date()) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const page = searchParams.get('page');
    const section = searchParams.get('section');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '100'), 200);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    if (id) {
      const pageContentId = parseInt(id);
      if (isNaN(pageContentId)) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const result = await db
        .select()
        .from(pageContents)
        .where(eq(pageContents.id, pageContentId))
        .limit(1);

      if (result.length === 0) {
        return NextResponse.json(
          { error: 'Page content not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(result[0], { status: 200 });
    }

    let query = db.select().from(pageContents);

    const conditions = [];
    if (page) {
      conditions.push(eq(pageContents.page, page));
    }
    if (section) {
      conditions.push(eq(pageContents.section, section));
    }

    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    const results = await query
      .orderBy(pageContents.page, pageContents.section, pageContents.displayOrder)
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await validateToken(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { page, section, contentType, fieldName, fieldValue, displayOrder } = body;

    if (!page || !section || !contentType || !fieldName) {
      return NextResponse.json(
        { error: 'Required fields: page, section, contentType, fieldName', code: 'MISSING_REQUIRED_FIELDS' },
        { status: 400 }
      );
    }

    if (typeof page !== 'string' || page.trim() === '') {
      return NextResponse.json(
        { error: 'Page must be a non-empty string', code: 'INVALID_PAGE' },
        { status: 400 }
      );
    }

    if (typeof section !== 'string' || section.trim() === '') {
      return NextResponse.json(
        { error: 'Section must be a non-empty string', code: 'MISSING_REQUIRED_FIELDS' },
        { status: 400 }
      );
    }

    if (typeof contentType !== 'string' || contentType.trim() === '') {
      return NextResponse.json(
        { error: 'Content type must be a non-empty string', code: 'INVALID_CONTENT_TYPE' },
        { status: 400 }
      );
    }

    if (typeof fieldName !== 'string' || fieldName.trim() === '') {
      return NextResponse.json(
        { error: 'Field name must be a non-empty string', code: 'MISSING_REQUIRED_FIELDS' },
        { status: 400 }
      );
    }

    if (!VALID_PAGES.includes(page)) {
      return NextResponse.json(
        { error: `Page must be one of: ${VALID_PAGES.join(', ')}`, code: 'INVALID_PAGE' },
        { status: 400 }
      );
    }

    if (!VALID_CONTENT_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: `Content type must be one of: ${VALID_CONTENT_TYPES.join(', ')}`, code: 'INVALID_CONTENT_TYPE' },
        { status: 400 }
      );
    }

    const finalDisplayOrder = displayOrder !== undefined ? parseInt(displayOrder) : 0;
    if (isNaN(finalDisplayOrder)) {
      return NextResponse.json(
        { error: 'Display order must be a valid integer', code: 'INVALID_DISPLAY_ORDER' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const newPageContent = await db
      .insert(pageContents)
      .values({
        page: page.trim(),
        section: section.trim(),
        contentType: contentType.trim(),
        fieldName: fieldName.trim(),
        fieldValue: fieldValue ? fieldValue.trim() : null,
        displayOrder: finalDisplayOrder,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newPageContent[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuthenticated = await validateToken(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const pageContentId = parseInt(id);

    const existing = await db
      .select()
      .from(pageContents)
      .where(eq(pageContents.id, pageContentId))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Page content not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { page, section, contentType, fieldName, fieldValue, displayOrder } = body;

    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (page !== undefined) {
      if (typeof page !== 'string' || page.trim() === '') {
        return NextResponse.json(
          { error: 'Page must be a non-empty string', code: 'INVALID_PAGE' },
          { status: 400 }
        );
      }
      if (!VALID_PAGES.includes(page)) {
        return NextResponse.json(
          { error: `Page must be one of: ${VALID_PAGES.join(', ')}`, code: 'INVALID_PAGE' },
          { status: 400 }
        );
      }
      updates.page = page.trim();
    }

    if (section !== undefined) {
      if (typeof section !== 'string' || section.trim() === '') {
        return NextResponse.json(
          { error: 'Section must be a non-empty string', code: 'MISSING_REQUIRED_FIELDS' },
          { status: 400 }
        );
      }
      updates.section = section.trim();
    }

    if (contentType !== undefined) {
      if (typeof contentType !== 'string' || contentType.trim() === '') {
        return NextResponse.json(
          { error: 'Content type must be a non-empty string', code: 'INVALID_CONTENT_TYPE' },
          { status: 400 }
        );
      }
      if (!VALID_CONTENT_TYPES.includes(contentType)) {
        return NextResponse.json(
          { error: `Content type must be one of: ${VALID_CONTENT_TYPES.join(', ')}`, code: 'INVALID_CONTENT_TYPE' },
          { status: 400 }
        );
      }
      updates.contentType = contentType.trim();
    }

    if (fieldName !== undefined) {
      if (typeof fieldName !== 'string' || fieldName.trim() === '') {
        return NextResponse.json(
          { error: 'Field name must be a non-empty string', code: 'MISSING_REQUIRED_FIELDS' },
          { status: 400 }
        );
      }
      updates.fieldName = fieldName.trim();
    }

    if (fieldValue !== undefined) {
      updates.fieldValue = fieldValue ? fieldValue.trim() : null;
    }

    if (displayOrder !== undefined) {
      const parsedDisplayOrder = parseInt(displayOrder);
      if (isNaN(parsedDisplayOrder)) {
        return NextResponse.json(
          { error: 'Display order must be a valid integer', code: 'INVALID_DISPLAY_ORDER' },
          { status: 400 }
        );
      }
      updates.displayOrder = parsedDisplayOrder;
    }

    const updated = await db
      .update(pageContents)
      .set(updates)
      .where(eq(pageContents.id, pageContentId))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAuthenticated = await validateToken(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const pageContentId = parseInt(id);

    const existing = await db
      .select()
      .from(pageContents)
      .where(eq(pageContents.id, pageContentId))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Page content not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(pageContents)
      .where(eq(pageContents.id, pageContentId))
      .returning();

    return NextResponse.json(
      {
        message: 'Page content deleted successfully',
        deleted: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}