'use client'

import { forwardRef } from 'react'
import { TextInput } from 'flowbite-react'

interface MoneyInputProps {
  value: number | string
  onChange: (value: number) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ value, onChange, placeholder = '0.00', disabled, className }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.replace(/[^\d.]/g, '')
      const numericValue = parseFloat(inputValue) || 0
      onChange(numericValue)
    }

    const displayValue = typeof value === 'number' ? value.toFixed(2) : value

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
          S/
        </span>
        <TextInput
          ref={ref}
          type="text"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={className}
          style={{ paddingLeft: '2.5rem' }}
        />
      </div>
    )
  }
)

MoneyInput.displayName = 'MoneyInput'