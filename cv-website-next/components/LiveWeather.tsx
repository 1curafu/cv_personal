'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/hooks/useLang'
import { useReveal } from '@/hooks/useReveal'
import type { TranslationKey } from '@/lib/translations'

type Weather = {
  city: string
  country: string
  temp: number
  feels: number
  wind: number
  humidity: number
  condKey: TranslationKey
  emoji: string
}

type Place = {
  id: number
  name: string
  latitude: number
  longitude: number
  country?: string
  country_code?: string
  admin1?: string
}

// Map a WMO weather code (Open-Meteo) to a translatable label + emoji.
function describe(code: number): { condKey: TranslationKey; emoji: string } {
  if (code === 0) return { condKey: 'condClear', emoji: '☀️' }
  if (code === 1 || code === 2) return { condKey: 'condPartly', emoji: '⛅' }
  if (code === 3) return { condKey: 'condCloudy', emoji: '☁️' }
  if (code === 45 || code === 48) return { condKey: 'condFog', emoji: '🌫️' }
  if (code >= 51 && code <= 57) return { condKey: 'condDrizzle', emoji: '🌦️' }
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { condKey: 'condRain', emoji: '🌧️' }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { condKey: 'condSnow', emoji: '❄️' }
  if (code >= 95) return { condKey: 'condThunder', emoji: '⛈️' }
  return { condKey: 'condCloudy', emoji: '☁️' }
}

// Turn an ISO-2 country code into its flag emoji (e.g. "CH" → 🇨🇭).
function flag(code?: string): string {
  if (!code || code.length !== 2) return ''
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1f1e6 - 65 + c.charCodeAt(0)))
}

function placeRegion(p: Place): string {
  return [p.admin1, p.country].filter(Boolean).join(', ')
}

const DEFAULT_CITY = 'Rapperswil'

export default function LiveWeather() {
  const { t } = useLang()
  const headRef = useReveal()
  const cardRef = useReveal()
  const boxRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState(DEFAULT_CITY)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [data, setData] = useState<Weather | null>(null)

  const [suggestions, setSuggestions] = useState<Place[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const reqId = useRef(0)
  const suggestId = useRef(0)
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function fetchWeatherForPlace(place: Place) {
    const id = ++reqId.current
    setStatus('loading')
    try {
      const wxRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
          `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`,
      )
      const wx = await wxRes.json()
      const cur = wx?.current
      if (!cur) {
        if (id === reqId.current) setStatus('error')
        return
      }
      // Ignore responses from a request the user has already superseded.
      if (id !== reqId.current) return

      const { condKey, emoji } = describe(cur.weather_code)
      setData({
        city: place.name,
        country: placeRegion(place),
        temp: Math.round(cur.temperature_2m),
        feels: Math.round(cur.apparent_temperature),
        wind: Math.round(cur.wind_speed_10m),
        humidity: Math.round(cur.relative_humidity_2m),
        condKey,
        emoji,
      })
      setStatus('ok')
    } catch {
      if (id === reqId.current) setStatus('error')
    }
  }

  // Resolve a free-text query (form submit / initial load) to a place, then fetch.
  async function lookup(city: string) {
    const trimmed = city.trim()
    if (!trimmed) return
    const id = ++reqId.current
    setStatus('loading')
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=1&format=json`,
      )
      const geo = await geoRes.json()
      const place = geo?.results?.[0] as Place | undefined
      if (!place) {
        if (id === reqId.current) setStatus('error')
        return
      }
      if (id !== reqId.current) return
      await fetchWeatherForPlace(place)
    } catch {
      if (id === reqId.current) setStatus('error')
    }
  }

  async function fetchSuggestions(q: string) {
    const id = ++suggestId.current
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q.trim())}&count=5&format=json`,
      )
      const json = await res.json()
      if (id !== suggestId.current) return
      const results = (json?.results ?? []) as Place[]
      setSuggestions(results)
      setOpen(results.length > 0)
      setActiveIndex(-1)
    } catch {
      if (id === suggestId.current) {
        setSuggestions([])
        setOpen(false)
      }
    }
  }

  // Load a default city once on mount so the widget is never empty.
  useEffect(() => {
    lookup(DEFAULT_CITY)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Close the suggestions dropdown on any click outside the search box.
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  // Cancel any pending debounced lookup when the widget unmounts.
  useEffect(() => {
    return () => {
      if (debounce.current) clearTimeout(debounce.current)
    }
  }, [])

  function onChange(e: { target: { value: string } }) {
    const value = e.target.value
    setQuery(value)
    setActiveIndex(-1)
    if (debounce.current) clearTimeout(debounce.current)
    if (value.trim().length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }
    debounce.current = setTimeout(() => fetchSuggestions(value), 220)
  }

  function selectPlace(p: Place) {
    if (debounce.current) clearTimeout(debounce.current)
    setQuery(p.name)
    setSuggestions([])
    setOpen(false)
    setActiveIndex(-1)
    fetchWeatherForPlace(p)
  }

  function onKeyDown(e: {
    key: string
    preventDefault(): void
  }) {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => (i - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      selectPlace(suggestions[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  function onSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    if (debounce.current) clearTimeout(debounce.current)
    setOpen(false)
    lookup(query)
  }

  const rows: { label: string; value: string }[] = data
    ? [
        { label: t('liveFeels'), value: `${data.feels}°` },
        { label: t('liveWind'), value: `${data.wind} km/h` },
        { label: t('liveHumidity'), value: `${data.humidity}%` },
      ]
    : []

  return (
    <section id="live" className="py-[clamp(60px,9vw,130px)]">
      <div ref={headRef} className="reveal flex items-baseline gap-[18px] mb-12">
        <span className="font-display font-bold text-[15px] text-accent tracking-[.1em]">03</span>
        <h2 className="font-display font-bold text-[clamp(34px,6vw,64px)] tracking-tight">
          {t('liveHeading')}
        </h2>
      </div>

      <div ref={cardRef} className="reveal max-w-[560px] mx-auto">
        <p className="font-display font-medium text-[clamp(19px,2.4vw,26px)] leading-[1.3] text-center mb-7">
          {t('liveLead')}
        </p>

        <form onSubmit={onSubmit} className="flex flex-wrap justify-center gap-3">
          <div ref={boxRef} className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={query}
              onChange={onChange}
              onKeyDown={onKeyDown}
              onFocus={() => { if (suggestions.length > 0) setOpen(true) }}
              placeholder={t('livePlaceholder')}
              aria-label={t('livePlaceholder')}
              role="combobox"
              aria-expanded={open}
              aria-controls="live-suggestions"
              aria-activedescendant={activeIndex >= 0 ? `live-opt-${activeIndex}` : undefined}
              aria-autocomplete="list"
              autoComplete="off"
              className="w-full rounded-full border-[1.5px] border-line bg-bg-soft
                         text-ink px-5 py-3.5 text-[15px] outline-none
                         focus:border-accent focus:accent-ring transition-colors duration-200"
            />

            {open && suggestions.length > 0 && (
              <ul
                id="live-suggestions"
                role="listbox"
                className="absolute left-0 right-0 top-[calc(100%+8px)] z-50
                           bg-bg-soft border border-line rounded-2xl p-1.5
                           shadow-[0_18px_40px_-18px_rgba(0,0,0,.45)]"
              >
                {suggestions.map((p, i) => (
                  <li key={p.id} id={`live-opt-${i}`} role="option" aria-selected={i === activeIndex}>
                    <button
                      type="button"
                      onMouseDown={e => e.preventDefault()}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => selectPlace(p)}
                      className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-[10px]
                                  transition-colors ${i === activeIndex ? 'accent-bg-12' : ''}`}
                    >
                      <span aria-hidden className="text-[18px] leading-none">{flag(p.country_code)}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display font-semibold text-[15px] text-ink truncate">
                          {p.name}
                        </span>
                        {placeRegion(p) && (
                          <span className="block text-ink-2 text-[12.5px] truncate">{placeRegion(p)}</span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex items-center justify-center font-body font-bold text-[15px]
                       px-[26px] py-[14px] rounded-full bg-accent text-on-accent accent-shadow
                       hover:-translate-y-0.5 hover:accent-shadow-lg
                       disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0
                       transition-all duration-200"
          >
            {t('liveBtn')}
          </button>
        </form>

        <p className="mt-4 text-ink-2 text-[13px] text-center">{t('liveCaption')}</p>

        <div
          aria-live="polite"
          className="mt-9 rounded-[22px] border border-line p-[clamp(22px,4vw,34px)]
                     min-h-[260px] flex flex-col justify-center"
          style={{ background: 'color-mix(in srgb, var(--bg-soft) 72%, transparent)' }}
        >
          {status === 'error' ? (
            <p className="font-display font-semibold text-[clamp(18px,2.4vw,22px)] text-red-400">
              {t('liveError')}
            </p>
          ) : data ? (
            <div className={status === 'loading' ? 'opacity-50 transition-opacity' : 'transition-opacity'}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display font-semibold text-[clamp(22px,3.2vw,30px)] tracking-tight">
                    {data.city}
                  </p>
                  {data.country && <p className="text-ink-2 text-[14px] mt-0.5">{data.country}</p>}
                </div>
                <span aria-hidden className="text-[clamp(46px,8vw,68px)] leading-none">{data.emoji}</span>
              </div>

              <div className="flex items-end gap-3 mt-5">
                <span className="font-display font-bold text-[clamp(52px,11vw,84px)] leading-[.9] tracking-tight">
                  {data.temp}°
                </span>
                <span className="font-display font-medium text-[clamp(16px,2.4vw,20px)] text-ink-2 pb-2">
                  {t(data.condKey)}
                </span>
              </div>

              <ul className="mt-6 border-t border-line">
                {rows.map(r => (
                  <li key={r.label} className="flex justify-between gap-4 py-3 border-b border-line">
                    <span className="text-ink-2 text-[14px]">{r.label}</span>
                    <span className="font-display font-semibold text-[15px]">{r.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="font-display font-medium text-[clamp(18px,2.4vw,22px)] text-ink-2">
              {t('liveLoading')}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
