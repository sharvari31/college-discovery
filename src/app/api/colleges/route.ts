import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const state = searchParams.get('state') || ''
    const type = searchParams.get('type') || ''
    const minFees = searchParams.get('minFees')
    const maxFees = searchParams.get('maxFees')

    const colleges = await prisma.college.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { location: { contains: search, mode: 'insensitive' } },
              { state: { contains: search, mode: 'insensitive' } },
            ]
          } : {},
          state ? { state: { equals: state, mode: 'insensitive' } } : {},
          type ? { type: { equals: type, mode: 'insensitive' } } : {},
          minFees ? { fees: { gte: parseFloat(minFees) } } : {},
          maxFees ? { fees: { lte: parseFloat(maxFees) } } : {},
        ]
      },
      include: {
        courses: true,
        reviews: true,
      },
      orderBy: { rating: 'desc' }
    })

    return NextResponse.json(colleges)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch colleges' }, { status: 500 })
  }
}