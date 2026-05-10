import { useState } from 'react'
import { ExpenseFilter } from '@/utils/filtering'

interface ExpenseFilterProps {
  onFilterChange: (filters: ExpenseFilter) => void
  onReset: () => void
  categories?: string[]
  paidByOptions?: string[]
}

export function ExpenseFilterPanel({
  onFilterChange,
  onReset,
  categories = ['Accommodation', 'Transportation', 'Food & Dining', 'Activities & Entertainment', 'Shopping', 'Other'],
  paidByOptions = [],
}: ExpenseFilterProps) {
  const [filters, setFilters] = useState<ExpenseFilter>({
    searchTerm: '',
    category: 'all',
    minAmount: undefined,
    maxAmount: undefined,
    paidBy: 'all',
  })

  const handleChange = (key: keyof ExpenseFilter, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    setFilters({
      searchTerm: '',
      category: 'all',
      minAmount: undefined,
      maxAmount: undefined,
      paidBy: 'all',
    })
    onReset()
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Filter Expenses</h3>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input
          type="text"
          placeholder="Search by description..."
          value={filters.searchTerm || ''}
          onChange={(e) => handleChange('searchTerm', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={filters.category || 'all'}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Amount Range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
          <input
            type="number"
            placeholder="Min"
            value={filters.minAmount || ''}
            onChange={(e) => handleChange('minAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxAmount || ''}
            onChange={(e) => handleChange('maxAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Paid By */}
      {paidByOptions.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Paid By</label>
          <select
            value={filters.paidBy || 'all'}
            onChange={(e) => handleChange('paidBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Users</option>
            {paidByOptions.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>
      )}

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
