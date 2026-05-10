import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-semibold text-brand-text">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`border border-brand-border px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {helperText && <p className="text-xs text-brand-muted">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
