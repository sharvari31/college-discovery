import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const college = await prisma.college.findUnique({
      where: { id: parseInt(id) },
      include: { courses: true, reviews: true }
    })
    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 })
    }
    return NextResponse.json(college)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch college' }, { status: 500 })
  }
}