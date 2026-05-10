// Popular travel destinations
export const popularDestinations = [
  'Paris, France',
  'Tokyo, Japan',
  'New York, USA',
  'Barcelona, Spain',
  'London, United Kingdom',
  'Dubai, UAE',
  'Rome, Italy',
  'Amsterdam, Netherlands',
  'Bangkok, Thailand',
  'Singapore',
  'Vienna, Austria',
  'Berlin, Germany',
  'Istanbul, Turkey',
  'Cairo, Egypt',
  'Sydney, Australia',
  'Vancouver, Canada',
  'Seoul, South Korea',
  'Mexico City, Mexico',
  'Rio de Janeiro, Brazil',
  'Athens, Greece',
  'Venice, Italy',
  'Prague, Czech Republic',
  'Lisbon, Portugal',
  'Copenhagen, Denmark',
  'Mumbai, India',
]

// Common activities
export const suggestedActivities = [
  'Sightseeing',
  'Museum Visit',
  'Beach Day',
  'Hiking',
  'Food Tour',
  'Shopping',
  'Nightlife',
  'Water Sports',
  'Adventure Sports',
  'Spa & Wellness',
  'Cultural Tour',
  'Photography',
  'Local Market Visit',
  'Cooking Class',
  'Wine Tasting',
]

// Common expense categories
export const expenseCategories = [
  'Accommodation',
  'Transportation',
  'Food & Dining',
  'Activities & Entertainment',
  'Shopping',
  'Other',
]

// Get city suggestions based on input
export const getCitySuggestions = (input: string): string[] => {
  if (!input.trim()) return popularDestinations
  const lowerInput = input.toLowerCase()
  return popularDestinations.filter((city) => city.toLowerCase().includes(lowerInput)).slice(0, 5)
}

// Get activity suggestions based on input
export const getActivitySuggestions = (input: string): string[] => {
  if (!input.trim()) return suggestedActivities
  const lowerInput = input.toLowerCase()
  return suggestedActivities
    .filter((activity) => activity.toLowerCase().includes(lowerInput))
    .slice(0, 5)
}

// Get expense category suggestions
export const getExpenseCategorySuggestions = (input: string): string[] => {
  if (!input.trim()) return expenseCategories
  const lowerInput = input.toLowerCase()
  return expenseCategories
    .filter((category) => category.toLowerCase().includes(lowerInput))
    .slice(0, 5)
}
