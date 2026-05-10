// Advanced search with real-time suggestions

export interface SearchResult {
  id: string
  type: 'trip' | 'activity' | 'destination' | 'note'
  title: string
  description?: string
  destination?: string
  date?: string
}

export interface Suggestion {
  text: string
  type: 'destination' | 'activity' | 'category'
  popularity?: number
}

// Fetch with timeout
const fetchWithTimeout = async (url: string, timeout = 5000): Promise<Response> => {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(id)
    return response
  } catch (error) {
    clearTimeout(id)
    throw error
  }
}

// Debounce search queries
export const debounceSearch = (callback: (query: string) => void, delay = 300) => {
  let timeoutId: NodeJS.Timeout
  return (query: string) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => callback(query), delay)
  }
}

// Get suggestions based on query
export const getSearchSuggestions = async (query: string, type: 'all' | 'destination' | 'activity' = 'all'): Promise<Suggestion[]> => {
  if (!query || query.length < 2) return []

  try {
    const response = await fetchWithTimeout(`/api/search/suggestions?q=${encodeURIComponent(query)}&type=${type}`, 5000)
    if (!response.ok) return []
    const data = await response.json()
    return data.suggestions || []
  } catch (error) {
    console.error('Failed to fetch suggestions:', error)
    return []
  }
}

// Search across all content
export const globalSearch = async (query: string): Promise<SearchResult[]> => {
  if (!query || query.length < 2) return []

  try {
    const response = await fetchWithTimeout(`/api/search/global?q=${encodeURIComponent(query)}`, 5000)
    if (!response.ok) return []
    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Failed to search:', error)
    return []
  }
}

// Search specific types
export const searchTrips = async (query: string) => {
  if (!query || query.length < 2) return []
  try {
    const response = await fetch(`/api/search/trips?q=${encodeURIComponent(query)}`)
    if (!response.ok) return []
    const data = await response.json()
    return data.trips || []
  } catch (error) {
    console.error('Failed to search trips:', error)
    return []
  }
}

export const searchActivities = async (query: string) => {
  if (!query || query.length < 2) return []
  try {
    const response = await fetch(`/api/search/activities?q=${encodeURIComponent(query)}`)
    if (!response.ok) return []
    const data = await response.json()
    return data.activities || []
  } catch (error) {
    console.error('Failed to search activities:', error)
    return []
  }
}

export const searchNotes = async (query: string) => {
  if (!query || query.length < 2) return []
  try {
    const response = await fetch(`/api/search/notes?q=${encodeURIComponent(query)}`)
    if (!response.ok) return []
    const data = await response.json()
    return data.notes || []
  } catch (error) {
    console.error('Failed to search notes:', error)
    return []
  }
}

// Highlight matching text
export const highlightMatches = (text: string, query: string): string => {
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// Filter and rank results
export const rankResults = (results: SearchResult[], query: string): SearchResult[] => {
  return results.sort((a, b) => {
    const aScore = scoreMatch(a.title, query) + (a.description ? scoreMatch(a.description, query) * 0.5 : 0)
    const bScore = scoreMatch(b.title, query) + (b.description ? scoreMatch(b.description, query) * 0.5 : 0)
    return bScore - aScore
  })
}

const scoreMatch = (text: string, query: string): number => {
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()

  if (lowerText === lowerQuery) return 100 // Exact match
  if (lowerText.startsWith(lowerQuery)) return 50 // Starts with
  if (lowerText.includes(lowerQuery)) return 25 // Contains

  // Word-based matching
  const words = lowerText.split(/\s+/)
  const queryWords = lowerQuery.split(/\s+/)
  const matchedWords = queryWords.filter(qw => words.some(w => w.includes(qw)))
  return matchedWords.length > 0 ? matchedWords.length * 10 : 0
}
