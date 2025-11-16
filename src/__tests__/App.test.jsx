import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('E-Commerce Admin Portal', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('enters edit mode for Wireless Mouse', async () => {
    render(<App />)
    await userEvent.click(screen.getByText('Products'))

    // Find the product card by product name
    const productCard = screen.getByText('Wireless Mouse').closest('.product-card')

    // Click edit inside that card
    await userEvent.click(within(productCard).getByText('Edit Product'))

    // Verify edit mode controls appear inside that card
    expect(within(productCard).getByText('Save')).toBeInTheDocument()
    expect(within(productCard).getByText('Cancel')).toBeInTheDocument()
  })

  it('cancels edit mode for Wireless Mouse', async () => {
    render(<App />)
    await userEvent.click(screen.getByText('Products'))

    const productCard = screen.getByText('Wireless Mouse').closest('.product-card')
    await userEvent.click(within(productCard).getByText('Edit Product'))

    await userEvent.click(within(productCard).getByText('Cancel'))

    // Save button should no longer be visible in that card
    expect(within(productCard).queryByText('Save')).not.toBeInTheDocument()
  })

  it('saves edited product name for Wireless Mouse', async () => {
    render(<App />)
    await userEvent.click(screen.getByText('Products'))

    const productCard = screen.getByText('Wireless Mouse').closest('.product-card')
    await userEvent.click(within(productCard).getByText('Edit Product'))

    const nameInput = within(productCard).getByDisplayValue('Wireless Mouse')
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Updated Mouse')

    await userEvent.click(within(productCard).getByText('Save'))

    // Verify updated name is now rendered globally
    expect(screen.getByText('Updated Mouse')).toBeInTheDocument()
  })
})
