import { renderHook, act } from '@testing-library/react'
import { useLang } from '@/hooks/useLang'

describe('useLang', () => {
  beforeEach(() => localStorage.clear())

  it('defaults to en', () => {
    const { result } = renderHook(() => useLang())
    expect(result.current.lang).toBe('en')
  })

  it('t() returns correct English string', () => {
    const { result } = renderHook(() => useLang())
    expect(result.current.t('navAbout')).toBe('About')
  })

  it('setLang changes the active language', () => {
    const { result } = renderHook(() => useLang())
    act(() => result.current.setLang('de'))
    expect(result.current.lang).toBe('de')
    expect(result.current.t('navAbout')).toBe('Über mich')
  })

  it('persists lang to localStorage', () => {
    const { result } = renderHook(() => useLang())
    act(() => result.current.setLang('ru'))
    expect(localStorage.getItem('mk-lang')).toBe('ru')
  })

  it('reads saved lang from localStorage on mount', () => {
    localStorage.setItem('mk-lang', 'ua')
    const { result } = renderHook(() => useLang())
    expect(result.current.lang).toBe('ua')
  })
})
