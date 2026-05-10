import { useState, useEffect } from 'react'
import { checkBudgetThresholds, predictBudgetStatus, getAlerts, deleteAlert, BudgetAlert } from '@/utils/budgetAlerts'
import toast from 'react-hot-toast'

interface BudgetForecastProps {
  tripId: string
  expenses: any[]
  totalBudget: number
  startDate: string
  endDate: string
}

export function BudgetForecast({ tripId, expenses, totalBudget, startDate, endDate }: BudgetForecastProps) {
  const [alerts, setAlerts] = useState<BudgetAlert[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAlerts()
  }, [tripId])

  const loadAlerts = async () => {
    try {
      const data = await getAlerts(tripId)
      setAlerts(data)
    } catch (error) {
      console.error('Failed to load alerts:', error)
    }
  }

  const handleDeleteAlert = async (alertId: string) => {
    try {
      await deleteAlert(tripId, alertId)
      setAlerts(alerts.filter((a) => a.id !== alertId))
      toast.success('Alert deleted')
    } catch (error) {
      console.error('Failed to delete alert:', error)
      toast.error('Failed to delete alert')
    }
  }

  // Calculate metrics
  const budgetStatus = checkBudgetThresholds(expenses, totalBudget)
  const daysElapsed = Math.ceil((new Date().getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
  const totalDays = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
  const prediction = predictBudgetStatus(expenses, totalBudget, totalDays, Math.max(1, daysElapsed))

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'text-red-600 bg-red-50'
      case 'warning':
        return 'text-yellow-600 bg-yellow-50'
      case 'safe':
        return 'text-green-600 bg-green-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 0.9) return 'bg-red-500'
    if (percentage >= 0.75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="space-y-4">
      {/* Budget Status */}
      <div className={`rounded-lg p-4 ${getStatusColor(budgetStatus.status)}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">{budgetStatus.message}</h3>
          <span className="text-sm font-bold">{(budgetStatus.percentage * 100).toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${getProgressColor(budgetStatus.percentage)}`}
            style={{ width: `${Math.min(100, budgetStatus.percentage * 100)}%` }}
          />
        </div>
      </div>

      {/* Current Spending */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Current Spent</p>
          <p className="text-2xl font-bold text-gray-900">${prediction.currentSpent.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">of ${totalBudget.toFixed(2)}</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Daily Average</p>
          <p className="text-2xl font-bold text-gray-900">${prediction.dailyAverage.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">per day</p>
        </div>
      </div>

      {/* Projection */}
      <div className={`rounded-lg p-4 ${prediction.willExceedBudget ? 'bg-red-50 border border-red-300' : 'bg-blue-50 border border-blue-300'}`}>
        <h4 className="font-semibold mb-2">Projection</h4>
        <div className="space-y-1 text-sm">
          <p>
            <span className="text-gray-600">Projected Total:</span>{' '}
            <span className={`font-semibold ${prediction.willExceedBudget ? 'text-red-600' : 'text-gray-900'}`}>
              ${prediction.projectedTotal.toFixed(2)}
            </span>
          </p>
          <p>
            <span className="text-gray-600">Remaining Daily Budget:</span>{' '}
            <span className="font-semibold text-gray-900">${prediction.remainingDaily.toFixed(2)}</span>
          </p>
          {prediction.willExceedBudget && (
            <p className="text-red-600 font-semibold mt-2">
              ⚠️ You may exceed budget by ${(prediction.projectedTotal - totalBudget).toFixed(2)}
            </p>
          )}
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <h4 className="font-semibold mb-3">Active Alerts</h4>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {alert.type === 'threshold' && '💰 Budget Threshold'}
                    {alert.type === 'daily' && '📅 Daily Budget'}
                    {alert.type === 'category' && `📊 ${alert.category}`}
                  </p>
                  <p className="text-xs text-gray-600">{alert.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <button
                  onClick={() => handleDeleteAlert(alert.id)}
                  className="text-xs text-gray-500 hover:text-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 text-sm">
        <p className="font-semibold text-blue-900 mb-2">💡 Budget Tips:</p>
        <ul className="text-blue-800 space-y-1 list-disc list-inside">
          <li>Track all expenses to get accurate projections</li>
          <li>Set daily budget limits to avoid overspending</li>
          <li>Review expenses by category regularly</li>
          <li>Split expenses with travel companions fairly</li>
        </ul>
      </div>
    </div>
  )
}
