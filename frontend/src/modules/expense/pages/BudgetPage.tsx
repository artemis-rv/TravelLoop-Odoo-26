import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTripStore } from '@/store/trip.store'
import { Loader } from '@/components/common/Loader'
import { EmptyState } from '@/components/common/EmptyState'
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

  if (isLoading) {
    return <Loader fullScreen />
  }

  // Group expenses by category
  const groupedExpenses = (expenses || []).reduce((acc, expense) => {
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
      <h1 className="text-5xl font-black mb-10">Budget Planner</h1>

      {totals.length === 0 ? (
        <EmptyState
          icon="💰"
          title="No expenses yet"
          description="Add expenses to track your trip budget"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            {totals.map((item) => (
              <div
                key={item.category}
                className="bg-white border border-brand-border rounded-[28px] p-8"
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
        </>
      )}

      <Link
        to={`/trip/${id}/checklist`}
        className="bg-brand-gold px-8 py-4 rounded-2xl font-black inline-block hover:scale-105 transition"
      >
        Open Checklist
      </Link>
    </div>
  )
}
