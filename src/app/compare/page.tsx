'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface College {
  id: number
  name: string
  location: string
  state: string
  type: string
  fees: number
  rating: number
  description: string
  established: number
  courses: { id: number; name: string; duration: string; fees: number }[]
  reviews: { id: number; rating: number; comment: string; author: string }[]
}

function CompareContent() {
  const searchParams = useSearchParams()
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ids = searchParams.get('ids')?.split(',') || []
    Promise.all(
      ids.map(id => fetch(`/api/colleges/${id}`).then(res => res.json()))
    ).then(data => {
      setColleges(data)
      setLoading(false)
    })
  }, [searchParams])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500 text-xl">Loading comparison...</div>
    </div>
  )

  const metrics = [
    { label: 'Location', key: 'location', format: (c: College) => `${c.location}, ${c.state}` },
    { label: 'Type', key: 'type', format: (c: College) => c.type },
    { label: 'Annual Fees', key: 'fees', format: (c: College) => `₹${(c.fees / 100000).toFixed(1)}L` },
    { label: 'Rating', key: 'rating', format: (c: College) => `⭐ ${c.rating}` },
    { label: 'Established', key: 'established', format: (c: College) => `${c.established}` },
    { label: 'Courses', key: 'courses', format: (c: College) => `${c.courses.length} courses` },
    { label: 'Reviews', key: 'reviews', format: (c: College) => `${c.reviews.length} reviews` },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-blue-700 text-white py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-blue-200 hover:text-white mb-4 inline-block">← Back to Search</Link>
          <h1 className="text-4xl font-bold">Compare Colleges</h1>
          <p className="text-blue-200 mt-2">Side by side comparison of {colleges.length} colleges</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-5 text-gray-500 font-medium w-1/4">Criteria</th>
                {colleges.map(college => (
                  <th key={college.id} className="p-5 text-center">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      college.type === 'Government' ? 'bg-green-100 text-green-700' :
                      college.type === 'Private' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {college.type}
                    </span>
                    <div className="text-lg font-bold text-gray-800 mt-2">{college.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, i) => (
                <tr key={metric.key} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-5 font-medium text-gray-600">{metric.label}</td>
                  {colleges.map(college => {
                    const value = metric.format(college)
                    const isHighest = metric.key === 'rating' &&
                      college.rating === Math.max(...colleges.map(c => c.rating))
                    const isLowest = metric.key === 'fees' &&
                      college.fees === Math.min(...colleges.map(c => c.fees))
                    return (
                      <td key={college.id} className="p-5 text-center">
                        <span className={`${
                          isHighest ? 'text-green-600 font-bold' :
                          isLowest ? 'text-blue-600 font-bold' :
                          'text-gray-700'
                        }`}>
                          {value}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Courses Comparison */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Courses Comparison</h2>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${colleges.length}, 1fr)` }}>
            {colleges.map(college => (
              <div key={college.id} className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3">{college.name}</h3>
                {college.courses.length === 0 ? (
                  <p className="text-gray-400 text-sm">No courses listed</p>
                ) : college.courses.map(course => (
                  <div key={course.id} className="mb-2 pb-2 border-b last:border-0">
                    <p className="text-sm font-medium text-gray-700">{course.name}</p>
                    <p className="text-xs text-gray-500">{course.duration} • ₹{(course.fees / 100000).toFixed(1)}L</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CompareContent />
    </Suspense>
  )
}