export const generatePath = (path: string, params: Record<string, string | number>): string => {
  return path.replace(/:(\w+)/g, (_, key) => String(params[key]))
}

export const extractRouteParams = (pathname: string, pattern: string): Record<string, string> => {
  const patternParts = pattern.split('/')
  const pathParts = pathname.split('/')
  const params: Record<string, string> = {}

  patternParts.forEach((part, index) => {
    if (part.startsWith(':')) {
      const paramName = part.slice(1)
      params[paramName] = pathParts[index]
    }
  })

  return params
}

export const isPathMatch = (pathname: string, pattern: string): boolean => {
  const patternParts = pattern.split('/').filter(Boolean)
  const pathParts = pathname.split('/').filter(Boolean)

  if (patternParts.length !== pathParts.length) {
    return false
  }

  return patternParts.every((part, index) => {
    return part.startsWith(':') || part === pathParts[index]
  })
}
