import { useState } from 'react'
import {
  splitExpenseEqually,
  splitExpenseByPercentage,
  splitExpenseExact,
  validateSplitAmounts,
  ExpenseSplit,
  getSettlementReport,
  simplifySettlements,
  formatSettlement,
} from '@/utils/expenseSplitting'
import toast from 'react-hot-toast'

interface ExpenseSplitterProps {
  amount: number
  participants: Array<{ id: string; name: string }>
  onSplitComplete?: (splits: ExpenseSplit[]) => void
}

export function ExpenseSplitter({ amount, participants, onSplitComplete }: ExpenseSplitterProps) {
  const [splitType, setSplitType] = useState<'equal' | 'percentage' | 'exact'>('equal')
  const [splits, setSplits] = useState<ExpenseSplit[]>([])
  const [showSettlement, setShowSettlement] = useState(false)

  const handleSplitEqual = () => {
    const newSplits = splitExpenseEqually(amount, participants.map((p) => p.id))
    const withNames = newSplits.map((s) => ({
      ...s,
      userName: participants.find((p) => p.id === s.userId)?.name || '',
    }))
    setSplits(withNames)
    setSplitType('equal')
  }

  const handleSplitPercentage = () => {
    const percentages = participants.map((p) => ({
      userId: p.id,
      percentage: 100 / participants.length,
    }))
    const newSplits = splitExpenseByPercentage(amount, percentages)
    const withNames = newSplits.map((s) => ({
      ...s,
      userName: participants.find((p) => p.id === s.userId)?.name || '',
    }))
    setSplits(withNames)
    setSplitType('percentage')
  }

  const handleUpdateSplit = (userId: string, newAmount: number) => {
    const updated = splits.map((s) => (s.userId === userId ? { ...s, amount: newAmount } : s))
    setSplits(updated)
  }

  const handleSaveValidate = () => {
    const validation = validateSplitAmounts(splits, amount)
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid split')
      return
    }

    onSplitComplete?.(splits)
    toast.success('Split saved!')
  }

  if (splits.length === 0) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-lg">Split Expense: ${amount.toFixed(2)}</h3>
        <p className="text-sm text-gray-600">{participants.length} participants</p>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleSplitEqual}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition"
          >
            Split Equally
          </button>
          <button
            onClick={handleSplitPercentage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition"
          >
            Split by Percentage
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Divide: ${amount.toFixed(2)}</h3>
        <button
          onClick={() => setSplits([])}
          className="text-sm text-gray-500 hover:text-gray-700 transition"
        >
          Reset
        </button>
      </div>

      {/* Splits Table */}
      <div className="space-y-2">
        {splits.map((split) => (
          <div key={split.userId} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{split.userName}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">$</span>
              <input
                type="number"
                value={split.amount.toFixed(2)}
                onChange={(e) => handleUpdateSplit(split.userId, parseFloat(e.target.value) || 0)}
                className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total Check */}
      <div className="bg-blue-50 p-3 rounded">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Assigned:</span>
          <span className={`font-semibold ${Math.abs(splits.reduce((s, x) => s + x.amount, 0) - amount) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
            ${splits.reduce((s, x) => s + x.amount, 0).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={() => setShowSettlement(!showSettlement)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition"
        >
          View Settlement
        </button>
        <button
          onClick={handleSaveValidate}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition"
        >
          Save Split
        </button>
      </div>

      {/* Settlement View */}
      {showSettlement && (
        <div className="bg-gray-50 p-4 rounded mt-4 border border-gray-300">
          <h4 className="font-semibold mb-3">Settlement Summary</h4>
          <div className="space-y-2 text-sm">
            {splits.map((split) => (
              <div key={split.userId} className="flex justify-between text-gray-700">
                <span>{split.userName}</span>
                <span className="font-semibold">${split.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
