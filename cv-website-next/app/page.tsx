import BgField        from '@/components/BgField'
import Cursor         from '@/components/Cursor'
import ScrollProgress from '@/components/ScrollProgress'
import Nav            from '@/components/Nav'
import Hero           from '@/components/Hero'
import Marquee        from '@/components/Marquee'
import About          from '@/components/About'
import Work           from '@/components/Work'
import LiveWeather    from '@/components/LiveWeather'
import Timeline       from '@/components/Timeline'
import Skills         from '@/components/Skills'
import Contact        from '@/components/Contact'
import Footer         from '@/components/Footer'

export default function Page() {
  return (
    <>
      <BgField />
      <Cursor />
      <ScrollProgress />
      <Nav />
      <main className="w-[min(1180px,calc(100%-32px))] mx-auto">
        <Hero />
        <Marquee />
        <About />
        <Work />
        <LiveWeather />
        <Timeline />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
