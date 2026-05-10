import { useState } from 'react'
import { TripFilter } from '@/utils/filtering'

interface TripFilterProps {
  onFilterChange: (filters: TripFilter) => void
  onReset: () => void
}

export function TripFilterPanel({ onFilterChange, onReset }: TripFilterProps) {
  const [filters, setFilters] = useState<TripFilter>({
    searchTerm: '',
    status: 'all',
    minBudget: undefined,
    maxBudget: undefined,
  })

  const handleChange = (key: keyof TripFilter, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    setFilters({
      searchTerm: '',
      status: 'all',
      minBudget: undefined,
      maxBudget: undefined,
    })
    onReset()
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Filter Trips</h3>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input
          type="text"
          placeholder="Search by destination..."
          value={filters.searchTerm || ''}
          onChange={(e) => handleChange('searchTerm', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={filters.status || 'all'}
          onChange={(e) => handleChange('status', e.target.value as any)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Trips</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Budget Range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Budget</label>
          <input
            type="number"
            placeholder="Min"
            value={filters.minBudget || ''}
            onChange={(e) => handleChange('minBudget', e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Budget</label>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxBudget || ''}
            onChange={(e) => handleChange('maxBudget', e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition"
      >
        Reset Filters
      </button>
    </div>
  )
}
