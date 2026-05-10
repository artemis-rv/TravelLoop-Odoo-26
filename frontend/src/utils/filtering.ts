// Advanced filtering utilities

export interface TripFilter {
  searchTerm?: string
  startDate?: string
  endDate?: string
  status?: 'all' | 'upcoming' | 'ongoing' | 'completed'
  minBudget?: number
  maxBudget?: number
  travelers?: number
}

export interface ExpenseFilter {
  searchTerm?: string
  category?: string
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
  paidBy?: string
}

export const filterTrips = (trips: any[], filters: TripFilter) => {
  return trips.filter((trip) => {
    // Search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      if (!trip.destination?.toLowerCase().includes(term)) {
        return false
      }
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      const now = new Date()
      const tripStart = new Date(trip.startDate)
      const tripEnd = new Date(trip.endDate)

      switch (filters.status) {
        case 'upcoming':
          if (tripStart <= now) return false
          break
        case 'ongoing':
          if (tripStart > now || tripEnd < now) return false
          break
        case 'completed':
          if (tripEnd >= now) return false
          break
      }
    }

    // Date range filter
    if (filters.startDate) {
      const filterStart = new Date(filters.startDate)
      const tripStart = new Date(trip.startDate)
      if (tripStart < filterStart) return false
    }

    if (filters.endDate) {
      const filterEnd = new Date(filters.endDate)
      const tripEnd = new Date(trip.endDate)
      if (tripEnd > filterEnd) return false
    }

    // Budget filter
    if (filters.minBudget !== undefined && filters.minBudget !== null) {
      const totalExpenses = trip.expenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0) || 0
      if (totalExpenses < filters.minBudget) return false
    }

    if (filters.maxBudget !== undefined && filters.maxBudget !== null) {
      const totalExpenses = trip.expenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0) || 0
      if (totalExpenses > filters.maxBudget) return false
    }

    // Travelers filter
    if (filters.travelers !== undefined && filters.travelers !== null) {
      if ((trip.travelers?.length || 0) !== filters.travelers) return false
    }

    return true
  })
}

export const filterExpenses = (expenses: any[], filters: ExpenseFilter) => {
  return expenses.filter((expense) => {
    // Search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      if (!expense.description?.toLowerCase().includes(term)) {
        return false
      }
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      if (expense.category !== filters.category) return false
    }

    // Date range filter
    if (filters.startDate) {
      const filterStart = new Date(filters.startDate)
      const expenseDate = new Date(expense.createdAt)
      if (expenseDate < filterStart) return false
    }

    if (filters.endDate) {
      const filterEnd = new Date(filters.endDate)
      const expenseDate = new Date(expense.createdAt)
      if (expenseDate > filterEnd) return false
    }

    // Amount filter
    if (filters.minAmount !== undefined && filters.minAmount !== null) {
      if (expense.amount < filters.minAmount) return false
    }

    if (filters.maxAmount !== undefined && filters.maxAmount !== null) {
      if (expense.amount > filters.maxAmount) return false
    }

    // Paid by filter
    if (filters.paidBy && filters.paidBy !== 'all') {
      if (expense.paidBy !== filters.paidBy) return false
    }

    return true
  })
}

// Sorting utilities
export const sortTrips = (trips: any[], sortBy: 'date' | 'destination' | 'budget') => {
  const sorted = [...trips]
  switch (sortBy) {
    case 'date':
      return sorted.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    case 'destination':
      return sorted.sort((a, b) => a.destination.localeCompare(b.destination))
    case 'budget':
      const budgetA = a.expenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0) || 0
      const budgetB = b.expenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0) || 0
      return sorted.sort((a, b) => budgetB - budgetA)
    default:
      return sorted
  }
}

export const sortExpenses = (
  expenses: any[],
  sortBy: 'date' | 'amount' | 'category'
) => {
  const sorted = [...expenses]
  switch (sortBy) {
    case 'date':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'amount':
      return sorted.sort((a, b) => b.amount - a.amount)
    case 'category':
      return sorted.sort((a, b) => a.category.localeCompare(b.category))
    default:
      return sorted
  }
}
