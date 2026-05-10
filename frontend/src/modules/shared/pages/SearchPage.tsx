import { useState, useRef, useCallback } from 'react'
import api from '@/services/api'

interface SearchResult {
  name: string
  country?: string
  kinds?: string
  dist?: number
  lat?: number
  lon?: number
  type: 'city' | 'activity'
}

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [searchMode, setSearchMode] = useState<'city' | 'activity'>('activity')
  const [groupBy, setGroupBy] = useState('none')
  const [filterBy, setFilterBy] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      setSearched(false)
      return
    }
    setLoading(true)
    setSearched(true)
    try {
      let data: SearchResult[] = []

      if (searchMode === 'city') {
        const response = await api.get(`/search/cities?q=${encodeURIComponent(q)}`)
        const cities = response.data?.data || response.data || []
        data = cities.map((c: any) => ({
          name: c.name,
          country: c.country,
          lat: c.latitude,
          lon: c.longitude,
          type: 'city' as const,
        }))
      } else {
        const response = await api.get(`/search/activities?city=${encodeURIComponent(q)}`)
        const activities = response.data?.data || response.data || []
        data = activities.map((a: any) => ({
          name: a.name,
          kinds: a.kinds,
          dist: a.dist,
          type: 'activity' as const,
        }))
      }

      // Apply sort
      if (sortBy === 'name') {
        data.sort((a, b) => a.name.localeCompare(b.name))
      } else if (sortBy === 'distance' && searchMode === 'activity') {
        data.sort((a, b) => (a.dist || 0) - (b.dist || 0))
      }

      setResults(data)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [searchMode, sortBy])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => performSearch(val), 600)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      performSearch(query)
    }
  }

  const formatKinds = (kinds: string) => {
    if (!kinds) return ''
    return kinds
      .split(',')
      .slice(0, 3)
      .map((k) => k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
      .join(' · ')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Search Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Mode toggle */}
        <div className="flex rounded-2xl border border-brand-border overflow-hidden">
          <button
            onClick={() => { setSearchMode('activity'); setResults([]); setSearched(false) }}
            className={`px-4 py-2.5 text-sm font-bold transition ${searchMode === 'activity' ? 'bg-brand-gold text-brand-dark' : 'bg-white text-brand-muted'}`}
          >
            Activities
          </button>
          <button
            onClick={() => { setSearchMode('city'); setResults([]); setSearched(false) }}
            className={`px-4 py-2.5 text-sm font-bold transition ${searchMode === 'city' ? 'bg-brand-gold text-brand-dark' : 'bg-white text-brand-muted'}`}
          >
            Cities
          </button>
        </div>

        <input
          type="text"
          placeholder={searchMode === 'activity' ? 'e.g. Paragliding, Goa...' : 'e.g. Paris, Tokyo...'}
          value={query}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          className="flex-1 border border-brand-border px-5 py-2.5 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all bg-white"
        />

        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
          className="border border-brand-border px-3 py-2.5 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold bg-white font-semibold text-sm text-brand-text"
        >
          <option value="none">Group by</option>
          <option value="type">Type</option>
          <option value="country">Country</option>
        </select>

        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="border border-brand-border px-3 py-2.5 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold bg-white font-semibold text-sm text-brand-text"
        >
          <option value="all">Filter</option>
          <option value="museum">Museum</option>
          <option value="beach">Beach</option>
          <option value="mountain">Mountain</option>
          <option value="restaurant">Restaurant</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-brand-border px-3 py-2.5 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold bg-white font-semibold text-sm text-brand-text"
        >
          <option value="default">Sort by...</option>
          <option value="name">Name</option>
          <option value="distance">Distance</option>
        </select>
      </div>

      {/* Results */}
      {(searched || loading) && (
        <div className="bg-white rounded-[28px] border border-brand-border overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-border">
            <h2 className="font-black text-lg text-brand-text">
              Results
              {results.length > 0 && (
                <span className="ml-2 text-brand-muted text-sm font-normal">({results.length} found)</span>
              )}
            </h2>
          </div>

          {loading ? (
            <div className="divide-y divide-brand-border/50">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-4 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="px-6 py-12 text-center text-brand-muted">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-semibold">No results found for "{query}"</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="divide-y divide-brand-border/50">
              {results.map((result, i) => (
                <div
                  key={i}
                  className="px-6 py-4 hover:bg-brand-light transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-brand-text truncate">{result.name}</p>
                    <p className="text-sm text-brand-muted mt-0.5">
                      {result.type === 'city'
                        ? `📍 ${result.country || ''} ${result.lat ? `· ${result.lat?.toFixed(2)}, ${result.lon?.toFixed(2)}` : ''}`
                        : result.kinds
                        ? `🏷️ ${formatKinds(result.kinds)}`
                        : 'Option and its details'}
                    </p>
                  </div>
                  <span className="ml-4 text-brand-muted group-hover:text-brand-gold transition text-lg">→</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state before search */}
      {!searched && !loading && (
        <div className="text-center py-20 text-brand-muted">
          <p className="text-5xl mb-4">🌍</p>
          <p className="font-bold text-xl mb-2">Search for cities or activities</p>
          <p className="text-sm">Type above to discover amazing places and things to do</p>
        </div>
      )}
    </div>
  )
}
