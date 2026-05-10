import { useState } from 'react'
import {
  batchDeleteExpenses,
  batchUpdateCategory,
  batchRecalculateSplits,
  selectExpenses,
  selectAllExpenses,
  getSelectedStats,
} from '@/utils/batchExpenses'
import toast from 'react-hot-toast'

interface BatchExpenseToolbarProps {
  tripId: string
  expenses: any[]
  onBatchActionComplete?: () => void
}

const EXPENSE_CATEGORIES = ['food', 'transport', 'accommodation', 'activities', 'shopping', 'other']

export function BatchExpenseToolbar({ tripId, expenses, onBatchActionComplete }: BatchExpenseToolbarProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)

  const selectedExpenses = expenses.filter((e) => selected.has(e.id))
  const stats = getSelectedStats(expenses, selected)

  const toggleExpense = (expenseId: string) => {
    const newSelected = selectExpenses(selected, expenseId, true)
    setSelected(newSelected)
  }

  const toggleSelectAll = () => {
    const newSelected = selectAllExpenses(expenses, selected)
    setSelected(newSelected)
  }

  const handleBatchDelete = async () => {
    if (!window.confirm(`Delete ${stats.count} expenses?`)) return

    setLoading(true)
    try {
      await batchDeleteExpenses(tripId, Array.from(selected))
      setSelected(new Set())
      onBatchActionComplete?.()
      toast.success(`${stats.count} expenses deleted`)
    } catch (error) {
      console.error('Batch delete failed:', error)
      toast.error('Failed to delete expenses')
    } finally {
      setLoading(false)
    }
  }

  const handleBatchUpdateCategory = async (category: string) => {
    setLoading(true)
    try {
      await batchUpdateCategory(tripId, Array.from(selected), category)
      setSelected(new Set())
      setShowCategoryPicker(false)
      onBatchActionComplete?.()
      toast.success(`${stats.count} expenses updated`)
    } catch (error) {
      console.error('Batch update failed:', error)
      toast.error('Failed to update expenses')
    } finally {
      setLoading(false)
    }
  }

  const handleBatchRecalculate = async () => {
    setLoading(true)
    try {
      await batchRecalculateSplits(tripId, Array.from(selected))
      setSelected(new Set())
      onBatchActionComplete?.()
      toast.success(`${stats.count} splits recalculated`)
    } catch (error) {
      console.error('Batch recalculate failed:', error)
      toast.error('Failed to recalculate splits')
    } finally {
      setLoading(false)
    }
  }

  if (selected.size === 0) {
    return null
  }

  return (
    <div className="sticky bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold text-gray-900">
            {stats.count} item{stats.count !== 1 ? 's' : ''} selected
          </p>
          <button
            onClick={() => setSelected(new Set())}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Clear
          </button>
        </div>

        <div className="bg-blue-50 p-3 rounded mb-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-600">Total:</p>
              <p className="font-semibold text-gray-900">${stats.total.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600">Average:</p>
              <p className="font-semibold text-gray-900">${stats.average.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Picker */}
      {showCategoryPicker ? (
        <div className="space-y-2 mb-4">
          <p className="text-sm font-semibold text-gray-700">Update category to:</p>
          <div className="grid grid-cols-2 gap-2">
            {EXPENSE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleBatchUpdateCategory(cat)}
                disabled={loading}
                className="bg-blue-100 hover:bg-blue-200 text-blue-900 px-3 py-1 rounded text-sm font-semibold transition disabled:opacity-50"
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowCategoryPicker(false)}
            className="w-full text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <button
            onClick={() => setShowCategoryPicker(true)}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded font-semibold text-sm transition disabled:opacity-50"
          >
            📁 Change Category
          </button>

          <button
            onClick={handleBatchRecalculate}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-semibold text-sm transition disabled:opacity-50"
          >
            🔄 Recalculate Splits
          </button>

          <button
            onClick={handleBatchDelete}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded font-semibold text-sm transition disabled:opacity-50"
          >
            🗑️ Delete {stats.count}
          </button>
        </div>
      )}
    </div>
  )
}
