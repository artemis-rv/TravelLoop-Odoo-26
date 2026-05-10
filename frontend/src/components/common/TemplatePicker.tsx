import { useState } from 'react'
import { getAllTemplates, getTemplate, createTripFromTemplate, TripTemplate } from '@/utils/tripTemplates'

interface TemplatePickerProps {
  onSelectTemplate?: (tripData: any) => void
  onClose?: () => void
}

export function TemplatePicker({ onSelectTemplate, onClose }: TemplatePickerProps) {
  const [templates, setTemplates] = useState<TripTemplate[]>(getAllTemplates())
  const [selectedTemplate, setSelectedTemplate] = useState<TripTemplate | null>(null)
  const [startDate, setStartDate] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length < 2) {
      setTemplates(getAllTemplates())
    } else {
      const filtered = getAllTemplates().filter(
        (t) =>
          t.destination.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase())
      )
      setTemplates(filtered)
    }
  }

  const handleSelectTemplate = (template: TripTemplate) => {
    setSelectedTemplate(template)
  }

  const handleCreateTrip = () => {
    if (!selectedTemplate || !startDate) {
      alert('Please select a template and start date')
      return
    }

    const tripData = createTripFromTemplate(selectedTemplate, startDate)
    onSelectTemplate?.(tripData)
    setSelectedTemplate(null)
    setStartDate('')
    onClose?.()
  }

  if (selectedTemplate) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">{selectedTemplate.destination}</h2>
            <button onClick={() => setSelectedTemplate(null)} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-gray-600">{selectedTemplate.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Duration</label>
                <p className="text-lg font-bold">{selectedTemplate.duration} days</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Estimated Budget</label>
                <p className="text-lg font-bold text-blue-600">${selectedTemplate.estimatedBudget}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Best Time to Visit</label>
              <p>{selectedTemplate.bestTimeToVisit}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Suggested Activities</label>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.suggestedActivities.map((activity) => (
                  <span key={activity} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {activity}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Packing Essentials</label>
              <ul className="space-y-1">
                {selectedTemplate.packingEssentials.map((item) => (
                  <li key={item} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-blue-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-1">
                Trip Start Date
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-2">Itinerary Preview:</p>
              <p className="text-sm text-gray-600">{selectedTemplate.popularItinerary}</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded transition"
              >
                Back
              </button>
              <button
                onClick={handleCreateTrip}
                disabled={!startDate}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Trip from Template
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Choose a Trip Template</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="px-6 py-4 border-b">
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {templates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No templates found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className="bg-white border border-gray-300 rounded-lg p-4 hover:shadow-lg hover:border-blue-500 transition text-left"
                >
                  <div className="text-3xl mb-2">{template.thumbnail || '🌍'}</div>
                  <h3 className="font-bold text-gray-900 mb-1">{template.destination}</h3>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>⏱️ {template.duration} days</span>
                    <span>💰 ${template.estimatedBudget}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
