import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dishes, session } from '@/db/schema';
import { eq, like, or, and } from 'drizzle-orm';

async function validateToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return null;
  }
  
  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return null;
  }

  try {
    const sessionRecord = await db.select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1);

    if (sessionRecord.length === 0) {
      return null;
    }

    return sessionRecord[0];
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const dish = await db.select()
        .from(dishes)
        .where(eq(dishes.id, parseInt(id)))
        .limit(1);

      if (dish.length === 0) {
        return NextResponse.json(
          { error: 'Dish not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(dish[0], { status: 200 });
    }

    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const available = searchParams.get('available');
    const styleFilter = searchParams.get('style');

    let query = db.select().from(dishes);
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(dishes.name, `%${search}%`),
          like(dishes.description, `%${search}%`),
          like(dishes.category, `%${search}%`)
        )
      );
    }

    if (category) {
      conditions.push(eq(dishes.category, category));
    }

    if (available !== null && available !== undefined) {
      const isAvailable = available === 'true';
      conditions.push(eq(dishes.isAvailable, isAvailable));
    }

    if (styleFilter) {
      conditions.push(eq(dishes.style, styleFilter));
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
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'MISSING_AUTH' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'MISSING_AUTH' },
        { status: 401 }
      );
    }

    const sessionRecord = await db.select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1);

    if (sessionRecord.length === 0) {
      return NextResponse.json(
        { error: 'Invalid token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, category, price, imageUrl, isAvailable, style } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required and cannot be empty', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!description || description.trim() === '') {
      return NextResponse.json(
        { error: 'Description is required and cannot be empty', code: 'MISSING_DESCRIPTION' },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required', code: 'MISSING_CATEGORY' },
        { status: 400 }
      );
    }

    if (!price) {
      return NextResponse.json(
        { error: 'Price is required', code: 'MISSING_PRICE' },
        { status: 400 }
      );
    }

    // Validate style field
    if (style !== undefined && style !== null && style !== '') {
      const validStyles = ['North Indian', 'South Indian'];
      if (!validStyles.includes(style)) {
        return NextResponse.json(
          { error: 'Style must be either "North Indian" or "South Indian"', code: 'INVALID_STYLE' },
          { status: 400 }
        );
      }
    }

    const now = new Date().toISOString();
    const insertData = {
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      price: price.trim(),
      imageUrl: imageUrl || null,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      style: (style && style.trim() !== '') ? style.trim() : null,
      createdAt: now,
      updatedAt: now,
    };

    const newDish = await db.insert(dishes)
      .values(insertData)
      .returning();

    return NextResponse.json(newDish[0], { status: 201 });
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
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'MISSING_AUTH' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'MISSING_AUTH' },
        { status: 401 }
      );
    }

    const sessionRecord = await db.select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1);

    if (sessionRecord.length === 0) {
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

    const existingDish = await db.select()
      .from(dishes)
      .where(eq(dishes.id, parseInt(id)))
      .limit(1);

    if (existingDish.length === 0) {
      return NextResponse.json(
        { error: 'Dish not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (body.name !== undefined) {
      if (body.name.trim() === '') {
        return NextResponse.json(
          { error: 'Name cannot be empty', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }
      updates.name = body.name.trim();
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

    if (body.category !== undefined) {
      updates.category = body.category.trim();
    }

    if (body.price !== undefined) {
      updates.price = body.price.trim();
    }

    if (body.imageUrl !== undefined) {
      updates.imageUrl = body.imageUrl;
    }

    if (body.isAvailable !== undefined) {
      updates.isAvailable = body.isAvailable;
    }

    if (body.style !== undefined) {
      if (body.style !== null && body.style !== '') {
        const validStyles = ['North Indian', 'South Indian'];
        if (!validStyles.includes(body.style)) {
          return NextResponse.json(
            { error: 'Style must be either "North Indian" or "South Indian"', code: 'INVALID_STYLE' },
            { status: 400 }
          );
        }
        updates.style = body.style.trim();
      } else {
        updates.style = null;
      }
    }

    const updatedDish = await db.update(dishes)
      .set(updates)
      .where(eq(dishes.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedDish[0], { status: 200 });
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
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'MISSING_AUTH' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'MISSING_AUTH' },
        { status: 401 }
      );
    }

    const sessionRecord = await db.select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1);

    if (sessionRecord.length === 0) {
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

    const existingDish = await db.select()
      .from(dishes)
      .where(eq(dishes.id, parseInt(id)))
      .limit(1);

    if (existingDish.length === 0) {
      return NextResponse.json(
        { error: 'Dish not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db.delete(dishes)
      .where(eq(dishes.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Dish deleted successfully',
        dish: deleted[0],
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