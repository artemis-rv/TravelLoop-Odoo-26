import { useState, useEffect } from 'react'
import { debounceSearch, getSearchSuggestions, globalSearch, SearchResult, rankResults } from '@/utils/search'

interface SearchBarProps {
  onSearch?: (results: SearchResult[]) => void
  onSuggestionSelect?: (result: SearchResult) => void
  placeholder?: string
}

export function SearchBar({ onSearch, onSuggestionSelect, placeholder = 'Search trips, activities, notes...' }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [results, setResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debouncedSearch = debounceSearch(async (q: string) => {
    if (!q || q.length < 2) {
      setSuggestions([])
      return
    }

    setError(null)
    setLoading(true)
    try {
      const sugg = await getSearchSuggestions(q)
      setSuggestions(sugg)
    } catch (error: any) {
      console.error('Failed to fetch suggestions:', error)
      setError('Connection timeout')
    } finally {
      setLoading(false)
    }
  }, 300)

  const handleSearch = async (q: string) => {
    setQuery(q)
    setError(null)
    debouncedSearch(q)

    if (q.length >= 2) {
      setLoading(true)
      try {
        const searchResults = await globalSearch(q)
        const ranked = rankResults(searchResults, q)
        setResults(ranked)
        setShowResults(true)
        onSearch?.(ranked)
      } catch (error: any) {
        console.error('Search failed:', error)
        setError('Search timed out. Backend may be offline.')
        setResults([])
      } finally {
        setLoading(false)
      }
    } else {
      setResults([])
      setShowResults(false)
    }
  }

  const handleSuggestionClick = async (suggestion: any) => {
    setQuery(suggestion.text)
    setError(null)
    setLoading(true)
    try {
      const searchResults = await globalSearch(suggestion.text)
      const ranked = rankResults(searchResults, suggestion.text)
      setResults(ranked)
      setShowResults(true)
      onSearch?.(ranked)
    } catch (error: any) {
      setError('Search timed out')
    } finally {
      setLoading(false)
      setSuggestions([])
    }
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
        <span className="text-gray-400">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          placeholder={placeholder}
          className="flex-1 outline-none"
        />
        {loading && <span className="text-gray-400 text-sm">Loading...</span>}
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-red-50 border border-red-300 rounded-lg p-3 text-sm text-red-700 z-50">
          ❌ {error}
          <p className="text-xs text-red-600 mt-1">💡 Tip: Make sure PostgreSQL is running: <code className="bg-red-100 px-2 py-1 rounded">net start postgresql-x64-16</code></p>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && !error && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <div className="max-h-64 overflow-y-auto">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 transition flex items-center gap-2"
              >
                <span className="text-sm text-gray-500">{suggestion.type}</span>
                <span>{suggestion.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {showResults && results.length > 0 && !error && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <div className="max-h-96 overflow-y-auto">
            {results.slice(0, 5).map((result) => (
              <button
                key={result.id}
                onClick={() => {
                  onSuggestionSelect?.(result)
                  setShowResults(false)
                  setQuery('')
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition border-b last:border-b-0"
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">
                    {result.type === 'trip' && '✈️'}
                    {result.type === 'activity' && '🎯'}
                    {result.type === 'note' && '📝'}
                    {result.type === 'destination' && '📍'}
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{result.title}</div>
                    {result.description && <div className="text-sm text-gray-600">{result.description}</div>}
                    {result.date && <div className="text-xs text-gray-500">{result.date}</div>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <div className="max-h-96 overflow-y-auto">
            {results.slice(0, 5).map((result) => (
              <button
                key={result.id}
                onClick={() => {
                  onSuggestionSelect?.(result)
                  setShowResults(false)
                  setQuery('')
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition border-b last:border-b-0"
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">
                    {result.type === 'trip' && '✈️'}
                    {result.type === 'activity' && '🎯'}
                    {result.type === 'note' && '📝'}
                    {result.type === 'destination' && '📍'}
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{result.title}</div>
                    {result.description && <div className="text-sm text-gray-600">{result.description}</div>}
                    {result.date && <div className="text-xs text-gray-500">{result.date}</div>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
