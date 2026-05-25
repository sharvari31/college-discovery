import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    await prisma.college.createMany({
      data: [
        { name: 'IIT Bombay', location: 'Mumbai', state: 'Maharashtra', type: 'Government', fees: 250000, rating: 4.8, description: 'Premier engineering institute of India', established: 1958 },
        { name: 'BITS Pilani', location: 'Pilani', state: 'Rajasthan', type: 'Private', fees: 450000, rating: 4.6, description: 'Top private technical university', established: 1964 },
        { name: 'NIT Trichy', location: 'Tiruchirappalli', state: 'Tamil Nadu', type: 'Government', fees: 150000, rating: 4.5, description: 'One of the best NITs in India', established: 1964 },
        { name: 'VIT Vellore', location: 'Vellore', state: 'Tamil Nadu', type: 'Private', fees: 350000, rating: 4.2, description: 'Large private university with good placements', established: 1984 },
        { name: 'IIIT Hyderabad', location: 'Hyderabad', state: 'Telangana', type: 'Deemed', fees: 300000, rating: 4.7, description: 'Top institute for CS and AI research', established: 1998 },
        { name: 'Jadavpur University', location: 'Kolkata', state: 'West Bengal', type: 'Government', fees: 50000, rating: 4.4, description: 'Premier state university', established: 1955 },
        { name: 'Manipal Institute of Technology', location: 'Manipal', state: 'Karnataka', type: 'Private', fees: 400000, rating: 4.1, description: 'Well known private engineering college', established: 1957 },
        { name: 'SRM Institute', location: 'Chennai', state: 'Tamil Nadu', type: 'Private', fees: 320000, rating: 4.0, description: 'Large private university with industry ties', established: 1985 },
        { name: 'Thapar Institute', location: 'Patiala', state: 'Punjab', type: 'Deemed', fees: 380000, rating: 4.3, description: 'Strong engineering programs', established: 1956 },
        { name: 'NMIMS Mumbai', location: 'Mumbai', state: 'Maharashtra', type: 'Deemed', fees: 500000, rating: 3.9, description: 'Strong management and technology programs', established: 1981 },
      ],
      skipDuplicates: true,
    })

    await prisma.course.createMany({
      data: [
        { name: 'B.Tech Computer Science', duration: '4 years', fees: 250000, collegeId: 1 },
        { name: 'B.Tech AI and Data Science', duration: '4 years', fees: 280000, collegeId: 1 },
        { name: 'B.Tech Computer Science', duration: '4 years', fees: 450000, collegeId: 2 },
        { name: 'M.Tech AI', duration: '2 years', fees: 300000, collegeId: 5 },
        { name: 'B.Tech CSE', duration: '4 years', fees: 300000, collegeId: 5 },
        { name: 'B.Tech Computer Science', duration: '4 years', fees: 350000, collegeId: 4 },
        { name: 'MBA Tech', duration: '5 years', fees: 500000, collegeId: 10 },
        { name: 'M.Tech AI', duration: '2 years', fees: 400000, collegeId: 10 },
      ],
      skipDuplicates: true,
    })

    await prisma.review.createMany({
      data: [
        { rating: 5, comment: 'Amazing research opportunities and faculty', author: 'Rahul S', collegeId: 1 },
        { rating: 4, comment: 'Great campus and placements but fees are high', author: 'Priya M', collegeId: 2 },
        { rating: 5, comment: 'Best institute for AI research in India', author: 'Arjun K', collegeId: 5 },
        { rating: 4, comment: 'Good infrastructure and industry connections', author: 'Sneha R', collegeId: 4 },
        { rating: 3, comment: 'Decent college but curriculum needs updating', author: 'Vikram P', collegeId: 10 },
      ],
      skipDuplicates: true,
    })

    return NextResponse.json({ message: 'Database seeded successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 })
  }
}