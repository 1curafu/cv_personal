'use client'

import { useState } from 'react'
import { useLang } from '@/hooks/useLang'
import { useReveal } from '@/hooks/useReveal'

export default function Contact() {
  const { t } = useLang()
  const headRef  = useReveal()
  const asideRef = useReveal()
  const formRef  = useReveal<HTMLFormElement>()

  const [status,  setStatus]  = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: { preventDefault(): void; currentTarget: EventTarget | null }) {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    if (!form.checkValidity()) { form.reportValidity(); return }

    setStatus('sending')
    setMessage('')

    const body = {
      name:    (form.elements.namedItem('name')    as HTMLInputElement).value,
      email:   (form.elements.namedItem('email')   as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setStatus('ok')
        setMessage('✓ Thanks! Your message is on its way.')
        form.reset()
        setTimeout(() => { setStatus('idle'); setMessage('') }, 5000)
      } else {
        const data = await res.json()
        setStatus('err')
        setMessage(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('err')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <section id="contact" className="py-[clamp(60px,9vw,130px)]">
      <div ref={headRef} className="reveal flex items-baseline gap-[18px] mb-12">
        <span className="font-display font-bold text-[15px] text-accent tracking-[.1em]">05</span>
        <h2 className="font-display font-bold text-[clamp(34px,6vw,64px)] tracking-tight">
          {t('contactHeading')}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[.9fr_1.1fr] gap-[clamp(30px,5vw,70px)]">
        <div ref={asideRef} className="reveal">
          <p className="font-display font-medium text-[clamp(20px,2.6vw,28px)] leading-[1.25] mb-[26px]">
            {t('contactLead')}
          </p>
          <a href="mailto:mykhailo.khimich@icloud.com"
             className="inline-block font-display font-semibold text-[clamp(16px,2vw,20px)]
                        text-accent border-b-2 border-transparent hover:border-accent transition-colors">
            mykhailo.khimich@icloud.com
          </a>
          <div className="flex gap-[18px] mt-[22px]">
            <a href="https://github.com/1curafu" target="_blank" rel="noopener noreferrer"
               className="font-bold text-ink-2 hover:text-accent transition-colors">
              GitHub ↗
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer"
               className="font-bold text-ink-2 hover:text-accent transition-colors">
              LinkedIn ↗
            </a>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} noValidate className="reveal grid gap-[18px]">
          <div className="field">
            <input type="text"  id="c-name"    name="name"    required placeholder=" " />
            <label htmlFor="c-name">{t('contactNameLabel')}</label>
          </div>
          <div className="field">
            <input type="email" id="c-email"   name="email"   required placeholder=" " />
            <label htmlFor="c-email">{t('contactEmailLabel')}</label>
          </div>
          <div className="field">
            <input type="text"  id="c-subject" name="subject" required placeholder=" " />
            <label htmlFor="c-subject">{t('contactSubjectLabel')}</label>
          </div>
          <div className="field">
            <textarea id="c-message" name="message" rows={4} required placeholder=" " />
            <label htmlFor="c-message">{t('contactMessageLabel')}</label>
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="justify-self-start inline-flex items-center justify-center font-body font-bold
                       text-[15px] px-[26px] py-[14px] rounded-full bg-accent text-on-accent
                       accent-shadow hover:-translate-y-0.5 hover:accent-shadow-lg
                       disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0
                       transition-all duration-200"
          >
            {status === 'sending' ? t('contactSending') : t('contactSubmitBtn')}
          </button>

          {message && (
            <p role="status" className={`font-semibold text-[14px]
                                         ${status === 'ok' ? 'text-emerald-500' : 'text-red-400'}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
