import BgField        from '@/components/BgField'
import Cursor         from '@/components/Cursor'
import ScrollProgress from '@/components/ScrollProgress'
import Nav            from '@/components/Nav'
import Hero           from '@/components/Hero'

export default function Page() {
  return (
    <>
      <BgField />
      <Cursor />
      <ScrollProgress />
      <Nav />
      <main className="w-[min(1180px,calc(100%-32px))] mx-auto">
        <Hero />
      </main>
    </>
  )
}
