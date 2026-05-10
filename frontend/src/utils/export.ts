// Export utilities for CSV and PDF

export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    alert('No data to export')
    return
  }

  // Get column headers
  const headers = Object.keys(data[0])
  const csv = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          // Escape quotes and wrap in quotes if needed
          if (value === null || value === undefined) return ''
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"` 
          }
          return value
        })
        .join(',')
    ),
  ].join('\n')

  // Download CSV
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportTripsToCSV = (trips: any[]) => {
  const data = trips.map((trip) => ({
    Destination: trip.destination,
    'Start Date': new Date(trip.startDate).toLocaleDateString(),
    'End Date': new Date(trip.endDate).toLocaleDateString(),
    Travelers: trip.travelers?.length || 0,
    'Total Expenses': trip.expenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0) || 0,
    Status: getStatus(trip),
  }))
  exportToCSV(data, `trips_${new Date().toISOString().split('T')[0]}`)
}

export const exportExpensesToCSV = (expenses: any[]) => {
  const data = expenses.map((expense) => ({
    Description: expense.description,
    Category: expense.category,
    Amount: expense.amount,
    'Paid By': expense.paidBy,
    Date: new Date(expense.createdAt).toLocaleDateString(),
  }))
  exportToCSV(data, `expenses_${new Date().toISOString().split('T')[0]}`)
}

export const exportTripDetailsToPDF = async (trip: any) => {
  // Dynamically import jsPDF for smaller bundle size when not used
  const { jsPDF } = await import('jspdf')
  const { autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF()
  const margin = 10
  const pageWidth = doc.internal.pageSize.getWidth()
  
  // Title
  doc.setFontSize(20)
  doc.text('Trip Details', margin, margin + 10)

  // Trip Information
  doc.setFontSize(12)
  let yPos = margin + 25
  doc.text(`Destination: ${trip.destination}`, margin, yPos)
  yPos += 8
  doc.text(
    `Duration: ${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`,
    margin,
    yPos
  )
  yPos += 8
  doc.text(`Travelers: ${trip.travelers?.length || 0}`, margin, yPos)
  
  // Budget Summary
  const totalExpenses = trip.expenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0) || 0
  yPos += 15
  doc.setFontSize(14)
  doc.text('Budget Summary', margin, yPos)
  yPos += 10
  doc.setFontSize(11)
  doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, margin, yPos)
  
  // Expenses Table
  if (trip.expenses && trip.expenses.length > 0) {
    yPos += 15
    doc.setFontSize(14)
    doc.text('Expenses', margin, yPos)
    
    const expenseData = trip.expenses.map((exp: any) => [
      exp.description,
      exp.category,
      `$${exp.amount.toFixed(2)}`,
      new Date(exp.createdAt).toLocaleDateString(),
    ])

    autoTable(doc, {
      head: [['Description', 'Category', 'Amount', 'Date']],
      body: expenseData,
      startY: yPos + 5,
      margin: margin,
      theme: 'grid',
      headStyles: { 
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    })
  }

  // Itinerary
  if (trip.stops && trip.stops.length > 0) {
    doc.addPage()
    yPos = margin + 10
    doc.setFontSize(14)
    doc.text('Itinerary', margin, yPos)
    
    trip.stops.forEach((stop: any, index: number) => {
      yPos += 10
      doc.setFontSize(12)
      doc.text(`Day ${index + 1}: ${stop.name}`, margin, yPos)
      yPos += 6
      doc.setFontSize(10)
      
      if (stop.activities && stop.activities.length > 0) {
        stop.activities.forEach((activity: any) => {
          const lines = doc.splitTextToSize(`• ${activity.title}: ${activity.description || ''}`, pageWidth - 2 * margin - 5)
          lines.forEach((line: string) => {
            doc.text(line, margin + 5, yPos)
            yPos += 4
          })
        })
      }
      yPos += 2
    })
  }

  // Footer
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(9)
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 5,
      { align: 'center' }
    )
  }

  doc.save(`trip_${trip.destination}_${new Date().toISOString().split('T')[0]}.pdf`)
}

// Helper function to determine trip status
const getStatus = (trip: any) => {
  const now = new Date()
  const tripStart = new Date(trip.startDate)
  const tripEnd = new Date(trip.endDate)

  if (tripStart > now) return 'Upcoming'
  if (tripEnd < now) return 'Completed'
  return 'Ongoing'
}
