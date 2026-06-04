import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PaletteProvider, usePalette } from '@/context/PaletteContext'

function TestConsumer() {
  const { palette, setPalette } = usePalette()
  return (
    <div>
      <span data-testid="palette">{palette}</span>
      <button onClick={() => setPalette('green')}>set green</button>
    </div>
  )
}

describe('PaletteContext', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-palette')
  })

  it('defaults to teal', () => {
    render(<PaletteProvider><TestConsumer /></PaletteProvider>)
    expect(screen.getByTestId('palette').textContent).toBe('teal')
  })

  it('sets data-palette attribute on html when changed', async () => {
    render(<PaletteProvider><TestConsumer /></PaletteProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'set green' }))
    expect(document.documentElement.getAttribute('data-palette')).toBe('green')
  })

  it('does not set data-palette attribute for default teal', () => {
    render(<PaletteProvider><TestConsumer /></PaletteProvider>)
    expect(document.documentElement.getAttribute('data-palette')).toBeNull()
  })

  it('persists palette to localStorage', async () => {
    render(<PaletteProvider><TestConsumer /></PaletteProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'set green' }))
    expect(localStorage.getItem('mk-palette')).toBe('green')
  })
})
