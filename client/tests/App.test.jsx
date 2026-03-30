import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from '../src/App'

test('renders Event Planner header', () => {
  // 1. Render the component to the virtual DOM
  render(<App />)

  // 2. Search for the text "Event Planner" (case-insensitive)
  const headerElement = screen.getByText(/Event Planner/i)

  // 3. Assert that the element is present in the document
  expect(headerElement).toBeInTheDocument()
})