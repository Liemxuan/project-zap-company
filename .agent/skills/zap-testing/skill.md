---
name: zap-testing
description: Generate Jest + React Testing Library tests for ZAP Design Engine components. Use when testing Next.js 15 + React 19 components, hooks, or utilities in the ZAP project.
---

# ZAP Design Engine Testing Skill

Generate high-quality frontend tests for the ZAP Design Engine using Jest + React Testing Library.

## Tech Stack

- **Framework:** Next.js 15.1.6
- **UI Library:** React 19.0.0
- **Testing:** Jest 29+ with React Testing Library
- **Language:** TypeScript 5.8.2
- **Backend:** Blazor/C# API (mocked in tests)

## When to Apply

Apply this skill when:

- Writing tests for ZAP components, hooks, or utilities
- Reviewing test coverage
- Testing user interactions or state management (Zustand)
- Verifying component rendering and props

## Quick Reference

### Commands

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### File Naming

- Component tests: `ComponentName.spec.tsx` (same directory as component)
- Hook tests: `use-hook-name.spec.ts`
- Utility tests: `utility-name.spec.ts`

## Test Structure Template

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import Component from './ComponentName'

// Mock external dependencies
vi.mock('@/service/api')

// Mock Zustand stores
import { useStore } from '@/store'

describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset Zustand store state
    useStore.setState({
      /* initial state */
    })
  })

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Component />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('should apply custom className', () => {
      render(<Component className="custom" />)
      expect(screen.getByRole('button')).toHaveClass('custom')
    })
  })

  describe('User Interactions', () => {
    it('should handle click events', () => {
      const handleClick = vi.fn()
      render(<Component onClick={handleClick} />)
      
      fireEvent.click(screen.getByRole('button'))
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Edge Cases', () => {
    it('should handle null data gracefully', () => {
      render(<Component data={null} />)
      expect(screen.getByText(/no data/i)).toBeInTheDocument()
    })
  })
})
```

## Core Principles

### 1. AAA Pattern (Arrange-Act-Assert)

Every test should clearly separate:

- **Arrange**: Setup test data and render component
- **Act**: Perform user actions
- **Assert**: Verify expected outcomes

### 2. Black-Box Testing

- Test observable behavior, not implementation details
- Use semantic queries (`getByRole`, `getByLabelText`)
- Prefer pattern matching over hardcoded strings

```typescript
// ✅ Good: Semantic and flexible
expect(screen.getByRole('status')).toBeInTheDocument()
expect(screen.getByText(/loading/i)).toBeInTheDocument()

// ❌ Avoid: Hardcoded implementation details
expect(screen.getByText('Loading...')).toBeInTheDocument()
```

### 3. Mock API Calls

Since ZAP connects to a Blazor backend, **always mock API calls**:

```typescript
// Mock the API module
vi.mock('@/service/api', () => ({
  fetchThemes: vi.fn(() => Promise.resolve({ themes: [] })),
  saveTheme: vi.fn(() => Promise.resolve({ success: true })),
}))

// Use in tests
import { fetchThemes } from '@/service/api'

it('should load themes on mount', async () => {
  (fetchThemes as vi.Mock).mockResolvedValue({ themes: [{ id: 1 }] })
  
  render(<ThemeSelector />)
  
  await waitFor(() => {
    expect(screen.getByText('Theme 1')).toBeInTheDocument()
  })
})
```

### 4. Test Zustand Stores

```typescript
import { useStore } from '@/store'

it('should update theme in store', () => {
  const { result } = renderHook(() => useStore())
  
  act(() => {
    result.current.setMerchantOverride({ primary: '#FF0000' })
  })
  
  expect(result.current.computedTheme.primary).toBe('#FF0000')
})
```

## Required Test Scenarios

### Always Required

1. **Rendering**: Component renders without crashing
2. **Props**: Required props, optional props, default values
3. **Edge Cases**: null, undefined, empty values

### Conditional (When Present)

| Feature | Test Focus |
| :--- | :--- |
| `useState` | Initial state, state transitions |
| `useEffect` | Side effects, cleanup |
| Event handlers | onClick, onChange, onSubmit |
| API calls | Loading, success, error states |
| Zustand stores | State updates, computed values |
| Forms | Validation, submission |

## ZAP-Specific Patterns

### Testing Theme Context

```typescript
import { ThemeState } from '@/types'

const mockTheme: ThemeState = {
  primary: '#7E22CE',
  secondary: '#F3E8FF',
  // ... other theme properties
}

it('should apply theme colors', () => {
  render(<Button theme={mockTheme} />)
  const button = screen.getByRole('button')
  expect(button).toHaveStyle({ backgroundColor: '#7E22CE' })
})
```

### Testing Role-Based Features

```typescript
import { useStore } from '@/store'

it('should show admin controls when role is admin', () => {
  useStore.setState({ userRole: 'admin' })
  
  render(<ConfigPanel />)
  
  expect(screen.getByText(/master theme/i)).toBeInTheDocument()
})

it('should hide admin controls when role is merchant', () => {
  useStore.setState({ userRole: 'merchant' })
  
  render(<ConfigPanel />)
  
  expect(screen.queryByText(/master theme/i)).not.toBeInTheDocument()
})
```

### Testing Next.js Features

```typescript
// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: '/test',
  }),
  usePathname: () => '/test',
}))

// Mock Next.js Image
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}))
```

## Coverage Goals

Aim for:

- ✅ **100%** function coverage
- ✅ **100%** statement coverage
- ✅ **>95%** branch coverage
- ✅ **>95%** line coverage

## Best Practices

1. **One behavior per test** - Each `it()` should test a single user-observable behavior
2. **Descriptive names** - Use `should <behavior> when <condition>` format
3. **Clean up** - Always `vi.clearAllMocks()` in `beforeEach()`
4. **Async handling** - Use `waitFor()` for async operations
5. **User-centric** - Test from the user's perspective, not implementation

## Example: Complete Component Test

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { UiKitSection } from './UiKitSection'
import { useStore } from '@/store'

vi.mock('@/service/api')

describe('UiKitSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useStore.setState({
      userRole: 'merchant',
      computedTheme: {
        primary: '#7E22CE',
        secondary: '#F3E8FF',
      },
    })
  })

  describe('Rendering', () => {
    it('should render brand colors section', () => {
      render(<UiKitSection category="Brand Colors" />)
      expect(screen.getByText(/brand colors/i)).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should update primary color on change', async () => {
      render(<UiKitSection category="Brand Colors" />)
      
      const colorInput = screen.getByLabelText(/primary color/i)
      fireEvent.change(colorInput, { target: { value: '#FF0000' } })
      
      await waitFor(() => {
        expect(useStore.getState().computedTheme.primary).toBe('#FF0000')
      })
    })
  })

  describe('Role-Based Rendering', () => {
    it('should show merchant controls for merchant role', () => {
      useStore.setState({ userRole: 'merchant' })
      render(<UiKitSection category="Brand Colors" />)
      
      expect(screen.getByText(/customize/i)).toBeInTheDocument()
    })

    it('should show admin controls for admin role', () => {
      useStore.setState({ userRole: 'admin' })
      render(<UiKitSection category="Brand Colors" />)
      
      expect(screen.getByText(/master theme/i)).toBeInTheDocument()
    })
  })
})
```

---

**For skill updates:** All ZAP Design Engine tests should follow these patterns and use Jest + React Testing Library with the Next.js 15 + React 19 stack.
