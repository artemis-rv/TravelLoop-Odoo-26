export interface ValidationRule {
  validate: (value: any) => boolean
  message: string
}

export interface FieldError {
  field: string
  message: string
}

// Email validation
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const validateEmail = (email: string): boolean => {
  return emailRegex.test(email)
}

// Password validation
export const validatePassword = (password: string): boolean => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return regex.test(password)
}

// Date validation
export const validateDate = (date: string): boolean => {
  return date !== '' && !isNaN(new Date(date).getTime())
}

// Date range validation
export const validateDateRange = (startDate: string, endDate: string): boolean => {
  if (!validateDate(startDate) || !validateDate(endDate)) return false
  return new Date(startDate) <= new Date(endDate)
}

// Required field validation
export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim() !== ''
  }
  return value !== null && value !== undefined
}

// Min length validation
export const validateMinLength = (value: string, min: number): boolean => {
  return value.length >= min
}

// Max length validation
export const validateMaxLength = (value: string, max: number): boolean => {
  return value.length <= max
}

// Number validation
export const validateNumber = (value: any): boolean => {
  return !isNaN(Number(value)) && value !== ''
}

// Positive number validation
export const validatePositiveNumber = (value: any): boolean => {
  return validateNumber(value) && Number(value) > 0
}

// Field-level validation rules
export const fieldValidationRules: Record<string, ValidationRule[]> = {
  email: [
    {
      validate: validateRequired,
      message: 'Email is required',
    },
    {
      validate: validateEmail,
      message: 'Please enter a valid email address',
    },
  ],
  password: [
    {
      validate: validateRequired,
      message: 'Password is required',
    },
    {
      validate: (val) => validateMinLength(val, 8),
      message: 'Password must be at least 8 characters',
    },
    {
      validate: validatePassword,
      message: 'Password must contain uppercase, lowercase, and numbers',
    },
  ],
  confirmPassword: [
    {
      validate: validateRequired,
      message: 'Please confirm your password',
    },
  ],
  destination: [
    {
      validate: validateRequired,
      message: 'Destination is required',
    },
    {
      validate: (val) => validateMinLength(val, 2),
      message: 'Destination must be at least 2 characters',
    },
  ],
  startDate: [
    {
      validate: validateRequired,
      message: 'Start date is required',
    },
    {
      validate: validateDate,
      message: 'Please enter a valid start date',
    },
  ],
  endDate: [
    {
      validate: validateRequired,
      message: 'End date is required',
    },
    {
      validate: validateDate,
      message: 'Please enter a valid end date',
    },
  ],
  description: [
    {
      validate: (val) => validateMaxLength(val, 500),
      message: 'Description must be less than 500 characters',
    },
  ],
  amount: [
    {
      validate: validateRequired,
      message: 'Amount is required',
    },
    {
      validate: validatePositiveNumber,
      message: 'Amount must be a positive number',
    },
  ],
}

// Main validation function
export const validateField = (
  fieldName: string,
  value: any,
  additionalRules?: ValidationRule[]
): FieldError | null => {
  const rules = additionalRules || fieldValidationRules[fieldName] || []

  for (const rule of rules) {
    if (!rule.validate(value)) {
      return {
        field: fieldName,
        message: rule.message,
      }
    }
  }

  return null
}

// Form-level validation
export const validateForm = (
  formData: Record<string, any>,
  fieldsToValidate: string[]
): FieldError[] => {
  const errors: FieldError[] = []

  fieldsToValidate.forEach((fieldName) => {
    const error = validateField(fieldName, formData[fieldName])
    if (error) {
      errors.push(error)
    }
  })

  return errors
}

// Cross-field validation for password confirmation
export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword
}

// Cross-field validation for date range
export const validateFormDateRange = (
  formData: Record<string, any>
): FieldError[] => {
  const errors: FieldError[] = []

  if (formData.startDate && formData.endDate) {
    if (!validateDateRange(formData.startDate, formData.endDate)) {
      errors.push({
        field: 'endDate',
        message: 'End date must be after start date',
      })
    }
  }

  return errors
}

// Cross-field validation for password match
export const validateFormPasswordMatch = (
  formData: Record<string, any>
): FieldError[] => {
  const errors: FieldError[] = []

  if (formData.password && formData.confirmPassword) {
    if (!validatePasswordMatch(formData.password, formData.confirmPassword)) {
      errors.push({
        field: 'confirmPassword',
        message: 'Passwords do not match',
      })
    }
  }

  return errors
}

// Combine all validations
export const validateFormComplete = (
  formData: Record<string, any>,
  fieldsToValidate: string[]
): FieldError[] => {
  let errors = validateForm(formData, fieldsToValidate)

  // Add cross-field validations
  if (fieldsToValidate.includes('startDate') && fieldsToValidate.includes('endDate')) {
    errors = [...errors, ...validateFormDateRange(formData)]
  }

  if (fieldsToValidate.includes('password') && fieldsToValidate.includes('confirmPassword')) {
    errors = [...errors, ...validateFormPasswordMatch(formData)]
  }

  return errors
}
