// Reusable skeleton loader component
export const SkeletonText = ({ width = 'w-full', height = 'h-4' }: { width?: string; height?: string }) => (
  <div className={`${width} ${height} bg-gray-200 rounded animate-pulse`} />
)

export const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow p-6 space-y-4 animate-pulse">
    <SkeletonText height="h-6" width="w-3/4" />
    <SkeletonText height="h-4" width="w-full" />
    <SkeletonText height="h-4" width="w-5/6" />
    <div className="flex gap-2 pt-2">
      <SkeletonText height="h-8" width="w-20" />
      <SkeletonText height="h-8" width="w-20" />
    </div>
  </div>
)

export const SkeletonExpenseRow = () => (
  <div className="flex items-center gap-4 p-4 border-b animate-pulse">
    <SkeletonText height="h-4" width="w-24" />
    <SkeletonText height="h-4" width="w-32" />
    <SkeletonText height="h-4" width="w-20" />
    <SkeletonText height="h-4" width="w-16" />
  </div>
)

export const SkeletonGrid = ({ count = 3 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
)

export const SkeletonList = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonExpenseRow key={i} />
    ))}
  </div>
)
