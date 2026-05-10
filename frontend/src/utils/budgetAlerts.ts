// Budget alerts and notifications

export interface BudgetAlert {
  id: string
  tripId: string
  type: 'threshold' | 'daily' | 'category'
  threshold: number
  category?: string
  isActive: boolean
  createdAt: string
}

export interface BudgetNotification {
  id: string
  tripId: string
  type: 'warning' | 'critical' | 'milestone'
  message: string
  amount: number
  threshold: number
  createdAt: string
  read: boolean
}

// Check budget thresholds
export const checkBudgetThresholds = (
  expenses: any[],
  totalBudget: number,
  warningThreshold = 0.75,
  criticalThreshold = 0.9
): { status: 'safe' | 'warning' | 'critical'; percentage: number; message: string } => {
  const totalSpent = expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0)
  const percentage = totalSpent / totalBudget

  if (percentage >= criticalThreshold) {
    return {
      status: 'critical',
      percentage,
      message: `⚠️ CRITICAL: You've spent ${(percentage * 100).toFixed(0)}% of your budget!`,
    }
  }

  if (percentage >= warningThreshold) {
    return {
      status: 'warning',
      percentage,
      message: `⚠️ WARNING: You've spent ${(percentage * 100).toFixed(0)}% of your budget.`,
    }
  }

  return {
    status: 'safe',
    percentage,
    message: `✅ Budget is ${((1 - percentage) * 100).toFixed(0)}% available.`,
  }
}

// Check category budget
export const checkCategoryBudget = (
  expenses: any[],
  categoryBudget: Record<string, number>
): Record<string, { status: 'safe' | 'warning' | 'critical'; spent: number; limit: number }> => {
  const result: Record<string, any> = {}

  for (const [category, limit] of Object.entries(categoryBudget)) {
    const spent = expenses
      .filter((e) => e.category === category)
      .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)

    const percentage = spent / limit

    result[category] = {
      spent,
      limit,
      status: percentage >= 0.9 ? 'critical' : percentage >= 0.75 ? 'warning' : 'safe',
    }
  }

  return result
}

// Create alert
export const createBudgetAlert = async (tripId: string, alert: Omit<BudgetAlert, 'id' | 'createdAt'>) => {
  const response = await fetch(`/api/trips/${tripId}/alerts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alert),
  })

  if (!response.ok) throw new Error('Failed to create alert')
  return response.json()
}

// Get alerts
export const getAlerts = async (tripId: string): Promise<BudgetAlert[]> => {
  try {
    const response = await fetch(`/api/trips/${tripId}/alerts`)
    if (!response.ok) return []
    const data = await response.json()
    return data.alerts || []
  } catch (error) {
    console.error('Failed to fetch alerts:', error)
    return []
  }
}

// Delete alert
export const deleteAlert = async (tripId: string, alertId: string) => {
  const response = await fetch(`/api/trips/${tripId}/alerts/${alertId}`, {
    method: 'DELETE',
  })

  if (!response.ok) throw new Error('Failed to delete alert')
}

// Get notifications
export const getNotifications = async (tripId: string): Promise<BudgetNotification[]> => {
  try {
    const response = await fetch(`/api/trips/${tripId}/notifications`)
    if (!response.ok) return []
    const data = await response.json()
    return data.notifications || []
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    return []
  }
}

// Mark notification as read
export const markNotificationAsRead = async (tripId: string, notificationId: string) => {
  const response = await fetch(`/api/trips/${tripId}/notifications/${notificationId}/read`, {
    method: 'POST',
  })

  if (!response.ok) throw new Error('Failed to mark notification as read')
}

// Get spending velocity (how fast budget is being spent)
export const getSpendingVelocity = (expenses: any[], days: number) => {
  if (expenses.length === 0) return 0
  const totalSpent = expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0)
  return totalSpent / days
}

// Predict budget status
export const predictBudgetStatus = (currentExpenses: any[], totalBudget: number, tripDurationDays: number, daysElapsed: number) => {
  const velocity = getSpendingVelocity(currentExpenses, daysElapsed || 1)
  const projectedTotal = velocity * tripDurationDays
  const remainingDays = tripDurationDays - daysElapsed

  return {
    currentSpent: currentExpenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0),
    projectedTotal,
    projectedRemaining: Math.max(0, totalBudget - projectedTotal),
    dailyAverage: velocity,
    remainingDaily: Math.max(0, (totalBudget - (velocity * daysElapsed)) / remainingDays),
    willExceedBudget: projectedTotal > totalBudget,
  }
}

// Get alert message
export const getAlertMessage = (alert: BudgetAlert, tripName: string): string => {
  switch (alert.type) {
    case 'threshold':
      return `Budget threshold alert for "${tripName}"`
    case 'daily':
      return `Daily budget exceeded for "${tripName}"`
    case 'category':
      return `${alert.category} budget exceeded for "${tripName}"`
    default:
      return `Budget alert for "${tripName}"`
  }
}
