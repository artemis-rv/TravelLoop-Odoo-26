import React from 'react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8">
      {icon && <div className="mb-4 text-6xl">{icon}</div>}
      <h3 className="text-2xl font-black text-brand-text mb-2">{title}</h3>
      {description && <p className="text-brand-muted text-center mb-6 max-w-md">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="bg-brand-gold text-brand-dark px-6 py-3 rounded-2xl font-bold hover:scale-105 transition"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
