import { renderHook, act } from '@testing-library/react'
import { createElement, type ReactNode } from 'react'
import { useLang } from '@/hooks/useLang'
import { LangProvider } from '@/context/LangContext'

// useLang now reads from a shared context, so the hook must be rendered
// inside a LangProvider (mirrors how the app wraps it in layout.tsx).
const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(LangProvider, null, children)

describe('useLang', () => {
  beforeEach(() => localStorage.clear())

  it('defaults to en', () => {
    const { result } = renderHook(() => useLang(), { wrapper })
    expect(result.current.lang).toBe('en')
  })

  it('t() returns correct English string', () => {
    const { result } = renderHook(() => useLang(), { wrapper })
    expect(result.current.t('navAbout')).toBe('About')
  })

  it('setLang changes the active language', () => {
    const { result } = renderHook(() => useLang(), { wrapper })
    act(() => result.current.setLang('de'))
    expect(result.current.lang).toBe('de')
    expect(result.current.t('navAbout')).toBe('Über mich')
  })

  it('persists lang to localStorage', () => {
    const { result } = renderHook(() => useLang(), { wrapper })
    act(() => result.current.setLang('ru'))
    expect(localStorage.getItem('mk-lang')).toBe('ru')
  })

  it('reads saved lang from localStorage on mount', () => {
    localStorage.setItem('mk-lang', 'ua')
    const { result } = renderHook(() => useLang(), { wrapper })
    expect(result.current.lang).toBe('ua')
  })

  it('throws when used outside a LangProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useLang())).toThrow(/LangProvider/)
    spy.mockRestore()
  })
})
