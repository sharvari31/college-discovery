'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
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
  website: string | null
  courses: { id: number; name: string; duration: string; fees: number }[]
  reviews: { id: number; rating: number; comment: string; author: string; createdAt: string }[]
}

export default function CollegeDetail() {
  const params = useParams()
  const [college, setCollege] = useState<College | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetch(`/api/colleges/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setCollege(data)
        setLoading(false)
      })
  }, [params.id])

  if (loading || !college) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500 text-xl">Loading...</div>
    </div>
  )

  const avgRating = college.reviews?.length
    ? (college.reviews.reduce((sum, r) => sum + r.rating, 0) / college.reviews.length).toFixed(1)
    : college.rating

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-blue-700 text-white py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="text-blue-200 hover:text-white mb-4 inline-block">← Back to Search</Link>
          <div className="flex justify-between items-start">
            <div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full mb-3 inline-block ${
                college.type === 'Government' ? 'bg-green-500' :
                college.type === 'Private' ? 'bg-blue-500' : 'bg-purple-500'
              }`}>
                {college.type}
              </span>
              <h1 className="text-4xl font-bold mb-2">{college.name}</h1>
              <p className="text-blue-200">📍 {college.location}, {college.state} • Est. {college.established}</p>
            </div>
            <div className="text-center bg-white bg-opacity-20 rounded-xl p-4">
              <div className="text-4xl font-bold">⭐ {avgRating}</div>
              <div className="text-blue-200 text-sm">{college.reviews?.length || 0} reviews</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm text-center">
            <div className="text-2xl font-bold text-blue-600">₹{(college.fees / 100000).toFixed(1)}L</div>
            <div className="text-gray-500 text-sm">Annual Fees</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm text-center">
            <div className="text-2xl font-bold text-blue-600">{college.courses?.length || 0}</div>
            <div className="text-gray-500 text-sm">Courses Offered</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm text-center">
            <div className="text-2xl font-bold text-blue-600">{college.established}</div>
            <div className="text-gray-500 text-sm">Year Established</div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b">
          {['overview', 'courses', 'reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 font-medium capitalize text-sm ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">About {college.name}</h2>
            <p className="text-gray-600 leading-relaxed">{college.description}</p>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-3">
            {!college.courses?.length ? (
              <div className="bg-white rounded-xl p-6 shadow-sm text-gray-500">No courses listed yet.</div>
            ) : college.courses.map(course => (
              <div key={course.id} className="bg-white rounded-xl p-5 shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800">{course.name}</h3>
                  <p className="text-gray-500 text-sm">Duration: {course.duration}</p>
                </div>
                <div className="text-blue-600 font-bold">₹{(course.fees / 100000).toFixed(1)}L/year</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-3">
            {!college.reviews?.length ? (
              <div className="bg-white rounded-xl p-6 shadow-sm text-gray-500">No reviews yet.</div>
            ) : college.reviews.map(review => (
              <div key={review.id} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800">{review.author}</span>
                  <span className="text-yellow-500">{'⭐'.repeat(Math.round(review.rating))}</span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}