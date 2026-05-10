// Trip templates for common destinations

export interface TripTemplate {
  id: string
  destination: string
  description: string
  duration: number
  estimatedBudget: number
  suggestedActivities: string[]
  bestTimeToVisit: string
  packingEssentials: string[]
  stops: TemplateStop[]
  popularItinerary: string
  thumbnail?: string
}

export interface TemplateStop {
  name: string
  description: string
  suggestedActivities: string[]
}

// Popular trip templates
export const TRIP_TEMPLATES: Record<string, TripTemplate> = {
  paris: {
    id: 'paris',
    destination: 'Paris, France',
    description: 'The City of Light - romantic, cultural, and iconic',
    duration: 5,
    estimatedBudget: 2500,
    suggestedActivities: ['Eiffel Tower', 'Louvre', 'Notre-Dame', 'Seine River Cruise', 'Versailles'],
    bestTimeToVisit: 'April-June, September-October',
    packingEssentials: ['Comfortable walking shoes', 'Camera', 'Light layers', 'Umbrella'],
    stops: [
      { name: 'Central Paris', description: 'Iconic landmarks', suggestedActivities: ['Eiffel Tower', 'Arc de Triomphe'] },
      { name: 'Louvre District', description: 'Art and culture', suggestedActivities: ['Louvre Museum', 'Seine Walk'] },
      { name: 'Versailles', description: 'Royal palace', suggestedActivities: ['Palace Tour', 'Gardens'] },
    ],
    popularItinerary: 'Day 1: Eiffel Tower & Seine | Day 2: Louvre & Museums | Day 3: Versailles | Day 4: Montmartre | Day 5: Shopping',
    thumbnail: '🗼',
  },
  tokyo: {
    id: 'tokyo',
    destination: 'Tokyo, Japan',
    description: 'Vibrant blend of ancient tradition and futuristic technology',
    duration: 5,
    estimatedBudget: 2000,
    suggestedActivities: ['Senso-ji Temple', 'Shibuya Crossing', 'Robot Restaurant', 'Tsukiji Market', 'Teamlab Borderless'],
    bestTimeToVisit: 'March-May, September-November',
    packingEssentials: ['Comfortable shoes', 'Universal adapter', 'Camera', 'Light jacket'],
    stops: [
      { name: 'Asakusa', description: 'Traditional Tokyo', suggestedActivities: ['Senso-ji Temple', 'Shopping'] },
      { name: 'Shibuya', description: 'Modern entertainment', suggestedActivities: ['Shibuya Crossing', 'Nightlife'] },
      { name: 'Akihabara', description: 'Tech & Gaming', suggestedActivities: ['Electronics', 'Anime Cafes'] },
    ],
    popularItinerary: 'Day 1: Asakusa & Traditional | Day 2: Shibuya & Modernism | Day 3: Teamlab Borderless | Day 4: Day trip to Mt. Fuji | Day 5: Shopping',
    thumbnail: '🗾',
  },
  newyork: {
    id: 'newyork',
    destination: 'New York, USA',
    description: 'The city that never sleeps - endless entertainment',
    duration: 5,
    estimatedBudget: 3000,
    suggestedActivities: ['Times Square', 'Central Park', 'Empire State Building', 'Broadway', 'Statue of Liberty'],
    bestTimeToVisit: 'May-September, December',
    packingEssentials: ['Comfortable walking shoes', 'Sunscreen', 'Warm jacket', 'Camera'],
    stops: [
      { name: 'Manhattan', description: 'Urban core', suggestedActivities: ['Times Square', 'Broadway'] },
      { name: 'Central Park', description: 'Green oasis', suggestedActivities: ['Park Walk', 'Picnic'] },
      { name: 'Downtown', description: 'Historic NYC', suggestedActivities: ['Statue of Liberty', 'Wall Street'] },
    ],
    popularItinerary: 'Day 1: Times Square & Broadway | Day 2: Central Park | Day 3: Empire State Building | Day 4: Statue of Liberty | Day 5: Museums',
    thumbnail: '🗽',
  },
}

// Get all templates
export const getAllTemplates = (): TripTemplate[] => {
  return Object.values(TRIP_TEMPLATES)
}

// Get template by id
export const getTemplate = (id: string): TripTemplate | undefined => {
  return TRIP_TEMPLATES[id.toLowerCase()]
}

// Search templates
export const searchTemplates = (query: string): TripTemplate[] => {
  const lowerQuery = query.toLowerCase()
  return Object.values(TRIP_TEMPLATES).filter(
    (template) =>
      template.destination.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.suggestedActivities.some((a) => a.toLowerCase().includes(lowerQuery))
  )
}

// Create trip from template
export const createTripFromTemplate = (template: TripTemplate, startDate: string) => {
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + template.duration - 1)

  return {
    destination: template.destination,
    startDate,
    endDate: endDate.toISOString().split('T')[0],
    description: template.description,
    estimatedBudget: template.estimatedBudget,
    suggestedStops: template.stops.map((stop) => ({
      name: stop.name,
      description: stop.description,
      suggestedActivities: stop.suggestedActivities,
    })),
    packingEssentials: template.packingEssentials,
  }
}

// Get template recommendations based on dates and budget
export const getTemplateRecommendations = (
  startDate: string,
  endDate: string,
  maxBudget: number
): TripTemplate[] => {
  const durationDays = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))

  return Object.values(TRIP_TEMPLATES).filter(
    (template) =>
      Math.abs(template.duration - durationDays) <= 2 && // Allow 2 days difference
      template.estimatedBudget <= maxBudget
  )
}

// Add custom template
export const createCustomTemplate = (template: Omit<TripTemplate, 'id'>): TripTemplate => {
  const newTemplate: TripTemplate = {
    ...template,
    id: template.destination.toLowerCase().replace(/[^a-z0-9]/g, '-'),
  }
  return newTemplate
}
