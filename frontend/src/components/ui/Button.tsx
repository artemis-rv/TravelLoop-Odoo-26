import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, disabled, className, ...props }, ref) => {
    const baseStyles = 'font-bold rounded-2xl transition-all duration-300 inline-flex items-center justify-center gap-2'

    const variantStyles = {
      primary: 'bg-brand-gold text-brand-dark hover:scale-105 disabled:opacity-50',
      secondary: 'bg-brand-light text-brand-dark hover:bg-brand-border disabled:opacity-50',
      outline: 'border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark disabled:opacity-50',
    }

    const sizeStyles = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {loading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
        {props.children}
      </button>
    )
  }
)

Button.displayName = 'Button'
