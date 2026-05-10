import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTripStore } from '@/store/trip.store'
import { EmptyState } from '@/components/common/EmptyState'
import { ExpenseFilterPanel } from '@/components/common/ExpenseFilterPanel'
import { SkeletonList } from '@/components/ui/Skeleton'
import { filterExpenses, sortExpenses, ExpenseFilter } from '@/utils/filtering'
import { exportExpensesToCSV, exportTripDetailsToPDF } from '@/utils/export'
import api from '@/services/api'
import toast from 'react-hot-toast'
import { Expense } from '@/types'

export const BudgetPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const selectedTrip = useTripStore((state) => state.selectedTrip)
  const setSelectedTrip = useTripStore((state) => state.setSelectedTrip)
  const isLoading = useTripStore((state) => state.isLoading)
  const setLoading = useTripStore((state) => state.setLoading)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filters, setFilters] = useState<ExpenseFilter>({})
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date')
  const [showFilter, setShowFilter] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    if (id) {
      if (!selectedTrip) {
        fetchTrip(id)
      } else {
        loadExpenses(id)
      }
    }
  }, [id, selectedTrip])

  const fetchTrip = async (tripId: string) => {
    setLoading(true)
    try {
      const response = await api.get(`/trips/${tripId}`)
      setSelectedTrip(response.data.trip)
      setExpenses(response.data.trip.expenses || [])
    } catch (err: any) {
      console.error('Failed to fetch trip:', err)
      toast.error('Failed to load trip')
    } finally {
      setLoading(false)
    }
  }

  const loadExpenses = async (tripId: string) => {
    try {
      const response = await api.get(`/trips/${tripId}/expenses`)
      setExpenses(response.data.expenses || [])
    } catch (err: any) {
      console.error('Failed to fetch expenses:', err)
      toast.error('Failed to load expenses')
    }
  }

  const handleExportPDF = async () => {
    if (!selectedTrip) return
    setExporting(true)
    try {
      await exportTripDetailsToPDF(selectedTrip)
      toast.success('PDF exported successfully!')
    } catch (err) {
      console.error('Failed to export PDF:', err)
      toast.error('Failed to export PDF')
    } finally {
      setExporting(false)
    }
  }

  const filteredExpenses = filterExpenses(expenses, filters)
  const sortedExpenses = sortExpenses(filteredExpenses, sortBy)

  // Group expenses by category
  const groupedExpenses = (sortedExpenses || []).reduce((acc, expense) => {
    const category = expense.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(expense)
    return acc
  }, {} as Record<string, Expense[]>)

  // Calculate totals
  const totals = Object.entries(groupedExpenses).map(([category, items]) => ({
    category,
    total: items.reduce((sum, item) => sum + (parseFloat(item.amount as any) || 0), 0),
  }))

  const grandTotal = totals.reduce((sum, item) => sum + item.total, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-5xl font-black">Budget Planner</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition flex items-center gap-2"
          >
            <span>🔍</span> Filter
          </button>
          <button
            onClick={() => exportExpensesToCSV(sortedExpenses)}
            disabled={sortedExpenses.length === 0}
            className="bg-green-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>📥</span> CSV
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting || !selectedTrip}
            className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>📄</span> PDF
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className="mb-6">
          <ExpenseFilterPanel
            onFilterChange={setFilters}
            onReset={() => setFilters({})}
            paidByOptions={selectedTrip?.travelers?.map((t: any) => t.name) || []}
          />
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <SkeletonList count={5} />
      ) : sortedExpenses.length === 0 ? (
        <EmptyState
          icon="💰"
          title={expenses.length === 0 ? "No expenses yet" : "No expenses match your filters"}
          description={expenses.length === 0 ? "Add expenses to track your trip budget" : "Try adjusting your filters"}
        />
      ) : (
        <>
          {/* Sort Dropdown */}
          <div className="mb-6 flex items-center gap-3">
            <label className="font-semibold text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            {totals.map((item) => (
              <div
                key={item.category}
                className="bg-white border border-brand-border rounded-[28px] p-8 hover:shadow-lg transition"
              >
                <p className="text-brand-muted mb-4">{item.category}</p>
                <h2 className="text-5xl font-black">${item.total.toFixed(2)}</h2>
              </div>
            ))}
          </div>

          <div className="bg-brand-gold bg-opacity-10 border border-brand-gold rounded-[28px] p-8 mb-10">
            <p className="text-brand-muted mb-2">Total Budget</p>
            <h2 className="text-6xl font-black text-brand-gold">${grandTotal.toFixed(2)}</h2>
          </div>

          {/* Expenses Table */}
          <div className="bg-white border border-brand-border rounded-[28px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-900">{expense.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{expense.category}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">${parseFloat(expense.amount as any).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(expense.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <Link
        to={`/trip/${id}/checklist`}
        className="bg-brand-gold px-8 py-4 rounded-2xl font-black inline-block hover:scale-105 transition mt-10"
      >
        Open Checklist
      </Link>
    </div>
  )
}
