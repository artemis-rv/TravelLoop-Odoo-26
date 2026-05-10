// Expense splitting for group trips

export interface ExpenseSplit {
  id: string
  expenseId: string
  userId: string
  userName: string
  amount: number
  splitType: 'equal' | 'percentage' | 'exact'
  percentage?: number
}

export interface SplitSummary {
  paidBy: string
  owesTo: Record<string, number>
  shouldReceive: Record<string, number>
}

// Split expense equally
export const splitExpenseEqually = (totalAmount: number, participantIds: string[]): ExpenseSplit[] => {
  const amountPerPerson = totalAmount / participantIds.length

  return participantIds.map((userId) => ({
    id: `split-${userId}-${Date.now()}`,
    expenseId: '',
    userId,
    userName: '',
    amount: amountPerPerson,
    splitType: 'equal',
  }))
}

// Split expense by percentage
export const splitExpenseByPercentage = (
  totalAmount: number,
  splits: Array<{ userId: string; percentage: number }>
): ExpenseSplit[] => {
  return splits.map((split) => ({
    id: `split-${split.userId}-${Date.now()}`,
    expenseId: '',
    userId: split.userId,
    userName: '',
    amount: (totalAmount * split.percentage) / 100,
    splitType: 'percentage',
    percentage: split.percentage,
  }))
}

// Split expense with exact amounts
export const splitExpenseExact = (
  splits: Array<{ userId: string; amount: number }>
): ExpenseSplit[] => {
  return splits.map((split) => ({
    id: `split-${split.userId}-${Date.now()}`,
    expenseId: '',
    userId: split.userId,
    userName: '',
    amount: split.amount,
    splitType: 'exact',
  }))
}

// Validate split amounts
export const validateSplitAmounts = (splits: ExpenseSplit[], totalAmount: number): { valid: boolean; error?: string } => {
  const totalSplit = splits.reduce((sum, split) => sum + split.amount, 0)
  const difference = Math.abs(totalSplit - totalAmount)

  // Allow small rounding differences (0.01)
  if (difference > 0.01) {
    return {
      valid: false,
      error: `Split amounts don't match total. Total: $${totalAmount.toFixed(2)}, Split: $${totalSplit.toFixed(2)}`,
    }
  }

  return { valid: true }
}

// Create split expense
export const createSplitExpense = async (expenseId: string, splits: ExpenseSplit[]) => {
  const validation = validateSplitAmounts(splits, splits.reduce((sum, s) => sum + s.amount, 0))
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  const response = await fetch(`/api/expenses/${expenseId}/splits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ splits }),
  })

  if (!response.ok) throw new Error('Failed to create split')
  return response.json()
}

// Get settlement report (who owes who)
export const getSettlementReport = (expenses: any[], participants: Array<{ id: string; name: string }>): Record<string, SplitSummary> => {
  const balances: Record<string, number> = {}

  // Initialize balances
  participants.forEach((p) => {
    balances[p.id] = 0
  })

  // Calculate balances
  expenses.forEach((exp) => {
    const paidById = exp.paidBy

    if (exp.splits && Array.isArray(exp.splits)) {
      exp.splits.forEach((split: ExpenseSplit) => {
        if (split.userId !== paidById) {
          balances[split.userId] -= split.amount // They owe this much
          balances[paidById] += split.amount // Payer is owed this much
        }
      })
    }
  })

  // Generate summary
  const summary: Record<string, SplitSummary> = {}

  participants.forEach((p) => {
    summary[p.id] = {
      paidBy: p.name,
      owesTo: {},
      shouldReceive: {},
    }

    Object.entries(balances).forEach(([userId, balance]) => {
      if (balance > 0.01) {
        // This person owes the payer
        const debtor = participants.find((x) => x.id === userId)
        if (debtor) {
          summary[p.id].owesTo[debtor.name] = Math.abs(balance)
        }
      } else if (balance < -0.01) {
        // The payer owes this person
        const creditor = participants.find((x) => x.id === userId)
        if (creditor) {
          summary[p.id].shouldReceive[creditor.name] = Math.abs(balance)
        }
      }
    })
  })

  return summary
}

// Simplify settlements (minimize number of transactions)
export const simplifySettlements = (
  balances: Record<string, number>
): Array<{ from: string; to: string; amount: number }> => {
  const settlements: Array<{ from: string; to: string; amount: number }> = []
  const balancesCopy = { ...balances }

  while (true) {
    // Find largest debtor and creditor
    let maxDebtor = ''
    let maxCreditor = ''
    let maxDebtAmount = 0
    let maxCreditAmount = 0

    Object.entries(balancesCopy).forEach(([person, balance]) => {
      if (balance < -maxDebtAmount) {
        maxDebtor = person
        maxDebtAmount = Math.abs(balance)
      }
      if (balance > maxCreditAmount) {
        maxCreditor = person
        maxCreditAmount = balance
      }
    })

    if (maxDebtAmount < 0.01 || maxCreditAmount < 0.01) break

    // Match them up
    const settlementAmount = Math.min(maxDebtAmount, maxCreditAmount)
    settlements.push({
      from: maxDebtor,
      to: maxCreditor,
      amount: settlementAmount,
    })

    balancesCopy[maxDebtor] += settlementAmount
    balancesCopy[maxCreditor] -= settlementAmount
  }

  return settlements
}

// Format settlement for display
export const formatSettlement = (from: string, to: string, amount: number): string => {
  return `${from} owes ${to} $${amount.toFixed(2)}`
}
