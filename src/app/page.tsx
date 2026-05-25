'use client'

import { useState, useEffect } from 'react'
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

export default function Home() {
  const [colleges, setColleges] = useState<College[]>([])
  const [search, setSearch] = useState('')
  const [state, setState] = useState('')
  const [type, setType] = useState('')
  const [loading, setLoading] = useState(true)
  const [compareList, setCompareList] = useState<number[]>([])

  useEffect(() => {
    fetchColleges()
  }, [search, state, type])

  const fetchColleges = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (state) params.set('state', state)
    if (type) params.set('type', type)
    const res = await fetch(`/api/colleges?${params}`)
    const data = await res.json()
    setColleges(data)
    setLoading(false)
  }

  const toggleCompare = (id: number) => {
    setCompareList(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : prev.length < 3 ? [...prev, id] : prev
    )
  }

  const states = ['Maharashtra', 'Tamil Nadu', 'Rajasthan', 'Telangana', 'West Bengal', 'Karnataka', 'Punjab']
  const types = ['Government', 'Private', 'Deemed']

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-700 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">College Discovery</h1>
          <p className="text-blue-200 text-lg">Find and compare the best colleges in India</p>
          <div className="mt-6">
            <input
              type="text"
              placeholder="Search colleges by name, city or state..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full max-w-2xl px-5 py-3 rounded-xl text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <select
            value={state}
            onChange={e => setState(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          {compareList.length >= 2 && (
            <Link
              href={`/compare?ids=${compareList.join(',')}`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Compare {compareList.length} Colleges →
            </Link>
          )}
        </div>

        {/* Results count */}
        <p className="text-gray-500 mb-6">
          {loading ? 'Loading...' : `${colleges.length} colleges found`}
        </p>

        {/* College Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map(college => (
              <div key={college.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      college.type === 'Government' ? 'bg-green-100 text-green-700' :
                      college.type === 'Private' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {college.type}
                    </span>
                    <span className="text-yellow-500 font-bold">⭐ {college.rating}</span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-800 mb-1">{college.name}</h2>
                  <p className="text-gray-500 text-sm mb-3">📍 {college.location}, {college.state}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{college.description}</p>

                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4 border-t pt-3">
                    <span>💰 ₹{(college.fees / 100000).toFixed(1)}L/year</span>
                    <span>📚 {college.courses.length} courses</span>
                    <span>Est. {college.established}</span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/college/${college.id}`}
                      className="flex-1 text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => toggleCompare(college.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                        compareList.includes(college.id)
                          ? 'bg-green-50 border-green-500 text-green-700'
                          : 'border-gray-300 text-gray-600 hover:border-blue-500'
                      }`}
                    >
                      {compareList.includes(college.id) ? '✓ Added' : '+ Compare'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}