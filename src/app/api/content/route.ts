import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { content, session } from '@/db/schema';
import { eq, like, or, and } from 'drizzle-orm';

async function validateToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  const sessionRecord = await db.select()
    .from(session)
    .where(eq(session.token, token))
    .limit(1);

  if (sessionRecord.length === 0) {
    return null;
  }

  return sessionRecord[0];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single content by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const contentRecord = await db.select()
        .from(content)
        .where(eq(content.id, parseInt(id)))
        .limit(1);

      if (contentRecord.length === 0) {
        return NextResponse.json(
          { error: 'Content not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(contentRecord[0], { status: 200 });
    }

    // List all content with filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const sectionFilter = searchParams.get('section');

    let query = db.select().from(content);

    const conditions = [];

    if (sectionFilter) {
      conditions.push(eq(content.section, sectionFilter));
    }

    if (search) {
      conditions.push(
        or(
          like(content.title, `%${search}%`),
          like(content.description, `%${search}%`)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query.limit(limit).offset(offset);

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
    // Authentication check
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'MISSING_AUTH' },
        { status: 401 }
      );
    }

    const validSession = await validateToken(request);
    if (!validSession) {
      return NextResponse.json(
        { error: 'Invalid token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { section, title, description, imageUrl } = body;

    // Validate required fields
    if (!section || section.trim() === '') {
      return NextResponse.json(
        { error: 'Section is required', code: 'MISSING_SECTION' },
        { status: 400 }
      );
    }

    if (!title || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    if (!description || description.trim() === '') {
      return NextResponse.json(
        { error: 'Description is required', code: 'MISSING_DESCRIPTION' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const newContent = await db.insert(content)
      .values({
        section: section.trim(),
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl || null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newContent[0], { status: 201 });
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
    // Authentication check
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'MISSING_AUTH' },
        { status: 401 }
      );
    }

    const validSession = await validateToken(request);
    if (!validSession) {
      return NextResponse.json(
        { error: 'Invalid token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if content exists
    const existingContent = await db.select()
      .from(content)
      .where(eq(content.id, parseInt(id)))
      .limit(1);

    if (existingContent.length === 0) {
      return NextResponse.json(
        { error: 'Content not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (body.section !== undefined) {
      if (body.section.trim() === '') {
        return NextResponse.json(
          { error: 'Section cannot be empty', code: 'INVALID_SECTION' },
          { status: 400 }
        );
      }
      updates.section = body.section.trim();
    }

    if (body.title !== undefined) {
      if (body.title.trim() === '') {
        return NextResponse.json(
          { error: 'Title cannot be empty', code: 'INVALID_TITLE' },
          { status: 400 }
        );
      }
      updates.title = body.title.trim();
    }

    if (body.description !== undefined) {
      if (body.description.trim() === '') {
        return NextResponse.json(
          { error: 'Description cannot be empty', code: 'INVALID_DESCRIPTION' },
          { status: 400 }
        );
      }
      updates.description = body.description.trim();
    }

    if (body.imageUrl !== undefined) {
      updates.imageUrl = body.imageUrl || null;
    }

    const updatedContent = await db.update(content)
      .set(updates)
      .where(eq(content.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedContent[0], { status: 200 });
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
    // Authentication check
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'MISSING_AUTH' },
        { status: 401 }
      );
    }

    const validSession = await validateToken(request);
    if (!validSession) {
      return NextResponse.json(
        { error: 'Invalid token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if content exists
    const existingContent = await db.select()
      .from(content)
      .where(eq(content.id, parseInt(id)))
      .limit(1);

    if (existingContent.length === 0) {
      return NextResponse.json(
        { error: 'Content not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db.delete(content)
      .where(eq(content.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      { 
        message: 'Content deleted successfully',
        deleted: deleted[0]
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