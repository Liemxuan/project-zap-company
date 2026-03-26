import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { Input } from './inputs'

// ZAP Testing Protocol: AAA pattern, Black-box testing
describe('Input Component (Genesis L3 Atom)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render the default outlined input without crashing', () => {
      render(<Input placeholder="Default Input" />)
      expect(screen.getByPlaceholderText('Default Input')).toBeInTheDocument()
    })

    it('should render the filled variant correctly', () => {
      render(<Input variant="filled" placeholder="Filled Input" />)
      const inputElement = screen.getByPlaceholderText('Filled Input')
      expect(inputElement).toHaveClass('bg-surface-container-low')
    })
  })

  describe('Props & States', () => {
    it('should apply custom className', () => {
      render(<Input className="custom-input-class" placeholder="Custom" />)
      expect(screen.getByPlaceholderText('Custom')).toHaveClass('custom-input-class')
    })

    it('should render in disabled state', () => {
      render(<Input disabled placeholder="Disabled" />)
      const inputElement = screen.getByPlaceholderText('Disabled')
      expect(inputElement).toBeDisabled()
      expect(inputElement).toHaveClass('cursor-not-allowed')
    })

    it('should render the error state correctly', () => {
      render(<Input isError placeholder="Error Input" />)
      const inputElement = screen.getByPlaceholderText('Error Input')
      expect(inputElement).toHaveClass('border-error')
      expect(inputElement).toHaveClass('text-error')
    })
  })

  describe('Icon Integration', () => {
    it('should render a leading icon wrapper when leadingIcon is provided', () => {
      const { container } = render(<Input leadingIcon="search" placeholder="Search" />)
      const inputElement = screen.getByPlaceholderText('Search')
      expect(inputElement).toHaveClass('pl-10')
      // Check if icon wrapper exists inside the relative div
      expect(container.querySelector('.absolute.left-0')).toBeInTheDocument()
    })

    it('should render a trailing icon wrapper when trailingIcon is provided', () => {
      const { container } = render(<Input trailingIcon="visibility" placeholder="Password" />)
      const inputElement = screen.getByPlaceholderText('Password')
      expect(inputElement).toHaveClass('pr-10')
      // Check if icon wrapper exists inside the relative div
      expect(container.querySelector('.absolute.right-0')).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should handle onChange events', () => {
      const handleChange = vi.fn()
      render(<Input onChange={handleChange} placeholder="Type here" />)
      
      const inputElement = screen.getByPlaceholderText('Type here')
      fireEvent.change(inputElement, { target: { value: 'Hel' } })
      
      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(inputElement).toHaveValue('Hel')
    })
  })
})
