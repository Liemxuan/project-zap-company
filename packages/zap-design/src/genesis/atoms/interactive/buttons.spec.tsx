import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { Button } from './buttons'

describe('Button Component (Genesis L3 Atom)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render the default solid button without crashing', () => {
      render(<Button>Click Me</Button>)
      expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument()
    })

    it('should apply solid variant styles by default', () => {
      render(<Button>Solid</Button>)
      const button = screen.getByRole('button', { name: 'Solid' })
      expect(button).toHaveClass('bg-brand-midnight text-cream-white')
    })

    it('should render the outline variant correctly', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole('button', { name: 'Outline' })
      expect(button).toHaveClass('bg-layer-cover text-brand-midnight')
    })
    
    it('should render the ghost variant correctly', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button', { name: 'Ghost' })
      expect(button).toHaveClass('bg-transparent', 'border-transparent')
    })
  })

  describe('Props', () => {
    it('should apply custom className', () => {
      render(<Button className="custom-button">Custom</Button>)
      expect(screen.getByRole('button', { name: 'Custom' })).toHaveClass('custom-button')
    })

    it('should pass through standard button attributes like disabled', () => {
      render(<Button disabled>Disabled</Button>)
      expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled()
    })
  })

  describe('User Interactions', () => {
    it('should handle click events', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Submit</Button>)
      
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })
})
