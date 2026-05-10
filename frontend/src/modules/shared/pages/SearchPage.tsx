import { useState, useRef, useCallback } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
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
        const cities = response.data?.data || (Array.isArray(response.data) ? response.data : [])
        data = (cities as any[]).map((c: any) => ({
          name: c.name,
          country: c.country,
          lat: c.latitude,
          lon: c.longitude,
          type: 'city' as const,
        }))
      } else {
        const response = await api.get(`/search/activities?city=${encodeURIComponent(q)}`)
        const activities = response.data?.data || (Array.isArray(response.data) ? response.data : [])
        data = (activities as any[]).map((a: any) => ({
          name: a.name,
          kinds: a.kinds || a.category,
          dist: a.dist || 0,
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
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center">
        <h1 className="text-5xl font-black mb-4">Discover Destinations</h1>
        <p className="text-brand-muted text-lg">Search for amazing cities or activities for your next trip</p>
      </div>

      {/* Search Controls */}
      <div className="bg-white p-8 rounded-[36px] border border-brand-border space-y-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder={searchMode === 'activity' ? 'e.g. Paragliding, Goa...' : 'e.g. Paris, Tokyo...'}
              value={query}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="!py-4 text-lg"
            />
          </div>
          <div className="flex rounded-2xl border border-brand-border overflow-hidden shrink-0">
            <button
              onClick={() => { setSearchMode('activity'); setResults([]); setSearched(false) }}
              className={`px-6 py-4 text-sm font-bold transition ${searchMode === 'activity' ? 'bg-brand-gold text-brand-dark' : 'bg-white text-brand-muted'}`}
            >
              Activities
            </button>
            <button
              onClick={() => { setSearchMode('city'); setResults([]); setSearched(false) }}
              className={`px-6 py-4 text-sm font-bold transition ${searchMode === 'city' ? 'bg-brand-gold text-brand-dark' : 'bg-white text-brand-muted'}`}
            >
              Cities
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="border border-brand-border px-5 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold bg-white font-semibold text-brand-text transition-all"
          >
            <option value="none">Group by</option>
            <option value="type">Type</option>
            <option value="country">Country</option>
          </select>

          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="border border-brand-border px-5 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold bg-white font-semibold text-brand-text transition-all"
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
            className="border border-brand-border px-5 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold bg-white font-semibold text-brand-text transition-all"
          >
            <option value="default">Sort by...</option>
            <option value="name">Name</option>
            <option value="distance">Distance</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {(searched || loading) && (
        <div className="bg-white rounded-[36px] border border-brand-border overflow-hidden shadow-sm">
          <div className="px-10 py-6 border-b border-brand-border flex items-center justify-between">
            <h2 className="font-black text-2xl text-brand-text">
              Results
            </h2>
            {results.length > 0 && (
              <span className="bg-brand-light text-brand-text px-4 py-1.5 rounded-full text-sm font-bold border border-brand-border">
                {results.length} found
              </span>
            )}
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
