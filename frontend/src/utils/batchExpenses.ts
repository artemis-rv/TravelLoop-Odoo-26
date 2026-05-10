// Batch expense operations

export interface BatchOperation {
  type: 'delete' | 'updateCategory' | 'updateSplitType'
  expenseIds: string[]
  data?: {
    category?: string
    splitType?: 'equal' | 'percentage' | 'exact'
  }
}

// Batch delete expenses
export const batchDeleteExpenses = async (tripId: string, expenseIds: string[]) => {
  const response = await fetch(`/api/trips/${tripId}/expenses/batch-delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expenseIds }),
  })

  if (!response.ok) throw new Error('Failed to delete expenses')
  return response.json()
}

// Batch update category
export const batchUpdateCategory = async (tripId: string, expenseIds: string[], category: string) => {
  const response = await fetch(`/api/trips/${tripId}/expenses/batch-update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expenseIds, category }),
  })

  if (!response.ok) throw new Error('Failed to update expenses')
  return response.json()
}

// Batch recalculate splits
export const batchRecalculateSplits = async (tripId: string, expenseIds: string[]) => {
  const response = await fetch(`/api/trips/${tripId}/expenses/batch-recalculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expenseIds }),
  })

  if (!response.ok) throw new Error('Failed to recalculate splits')
  return response.json()
}

// Select multiple expenses
export const selectExpenses = (selected: Set<string>, expenseId: string, multiSelect: boolean): Set<string> => {
  const newSelected = new Set(selected)

  if (multiSelect) {
    if (newSelected.has(expenseId)) {
      newSelected.delete(expenseId)
    } else {
      newSelected.add(expenseId)
    }
  } else {
    newSelected.clear()
    newSelected.add(expenseId)
  }

  return newSelected
}

// Select all expenses
export const selectAllExpenses = (expenses: any[], selected: Set<string>): Set<string> => {
  if (selected.size === expenses.length) {
    return new Set()
  }
  return new Set(expenses.map(e => e.id))
}

// Get statistics for selected
export const getSelectedStats = (expenses: any[], selected: Set<string>) => {
  const selectedExpenses = expenses.filter(e => selected.has(e.id))
  const total = selectedExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
  const count = selectedExpenses.length

  return {
    count,
    total,
    average: count > 0 ? total / count : 0,
  }
}

// Bulk operations history
export const logBulkOperation = (operation: BatchOperation, result: any) => {
  console.log('Bulk operation executed:', {
    timestamp: new Date().toISOString(),
    operation,
    result,
  })
}
