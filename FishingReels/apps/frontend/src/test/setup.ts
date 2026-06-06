// Registers @testing-library/jest-dom matchers on Vitest's `expect`
// (e.g. toBeInTheDocument, toHaveClass) and their TypeScript types.
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Unmount React trees between tests so the jsdom DOM doesn't leak across cases.
afterEach(() => {
  cleanup()
})
