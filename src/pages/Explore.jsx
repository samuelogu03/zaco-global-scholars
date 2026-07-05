import { useState, useMemo } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { countries } from '../data/countries'
import { universitiesByCountry } from '../data/universities'
import { scholarshipsByCountry } from '../data/scholarships'

export default function Explore() {
  const [tab, setTab] = useState('universities') // 'universities' | 'scholarships'
  const [query, setQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  const matches = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return countries.filter((c) => c.n.toLowerCase().includes(q) || c.r.toLowerCase().includes(q))
  }, [query])

  function pick(country) {
    setSelectedCountry(country)
    setQuery('')
  }

  function reset() {
    setSelectedCountry(null)
    setQuery('')
  }

  return (
    <div className="min-h-screen bg-obsidian">
      <Navbar />
      <section className="pt-32 pb-24 max-w-[1000px] mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold/70">Country Explorer</span>
          <h1 className="font-display font-bold text-3xl md:text-5xl tracking-tight leading-[0.95] text-warm-white mt-4">
            Find a Country.<br /><span className="text-warm-gray">Discover what fits you.</span>
          </h1>
          <p className="text-warm-gray font-light mt-4 max-w-lg mx-auto">
            Search a country to see universities and — once you pick one — the scholarships available there.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => { setTab('universities'); reset() }}
            className={`text-[10px] font-bold uppercase tracking-[0.15em] py-3 px-6 rounded-sm transition-all ${tab === 'universities' ? 'btn-gold' : 'btn-outline-gold'}`}
          >
            Universities
          </button>
          <button
            onClick={() => { setTab('scholarships'); reset() }}
            className={`text-[10px] font-bold uppercase tracking-[0.15em] py-3 px-6 rounded-sm transition-all ${tab === 'scholarships' ? 'btn-gold' : 'btn-outline-gold'}`}
          >
            Scholarships
          </button>
        </div>

        {/* Search box - countries are never listed in full; only matches to typed query */}
        {!selectedCountry && (
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <span className="iconify absolute left-4 top-1/2 -translate-y-1/2 text-deep-gray" data-icon="lucide:search" data-width="16"></span>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a country name (e.g. Canada)..."
                className="input-field pl-11"
              />
            </div>

            {query.trim() && (
              <div className="mt-3 flex flex-col gap-2">
                {matches.length === 0 && (
                  <p className="text-deep-gray text-sm text-center py-6">No country matches "{query}".</p>
                )}
                {matches.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => pick(c)}
                    className="card rounded-lg px-5 py-4 flex items-center justify-between text-left"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">{c.f}</span>
                      <span>
                        <span className="block text-warm-white text-sm font-medium">{c.n}</span>
                        <span className="block text-deep-gray text-[10px] uppercase tracking-wider">{c.r}</span>
                      </span>
                    </span>
                    <span className="iconify text-gold" data-icon="lucide:arrow-right" data-width="16"></span>
                  </button>
                ))}
              </div>
            )}

            {!query.trim() && (
              <p className="text-deep-gray text-xs text-center mt-6">
                Countries aren't listed here — start typing to search for the one you're interested in.
              </p>
            )}
          </div>
        )}

        {/* Result panel once a country is picked */}
        {selectedCountry && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedCountry.f}</span>
                <div>
                  <h2 className="font-display font-bold text-xl text-warm-white">{selectedCountry.n}</h2>
                  <p className="text-deep-gray text-xs uppercase tracking-wider">{selectedCountry.r}</p>
                </div>
              </div>
              <button onClick={reset} className="text-[10px] uppercase tracking-wider text-gold hover:underline flex items-center gap-1">
                <span className="iconify" data-icon="lucide:arrow-left" data-width="12"></span> Choose another country
              </button>
            </div>

            {tab === 'universities' && <UniversityResults country={selectedCountry} />}
            {tab === 'scholarships' && <ScholarshipResults country={selectedCountry} />}
          </div>
        )}
      </section>
      <Footer />
    </div>
  )
}

function UniversityResults({ country }) {
  const list = universitiesByCountry(country.code)
  if (list.length === 0) {
    return <p className="text-deep-gray text-sm text-center py-10">No universities listed yet for {country.n}. Submit an inquiry and our advisors will find options for you.</p>
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {list.map((u) => (
        <div key={u.n} className="card rounded-lg p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-crimson/10 border border-crimson/15 flex items-center justify-center font-display font-bold text-gold text-xs">
              {u.n.charAt(0)}
            </div>
            <span className="text-[9px] font-bold text-gold/60">World Rank #{u.rk}</span>
          </div>
          <h3 className="text-warm-white text-sm font-medium mb-1">{u.n}</h3>
          <div className="text-warm-gray text-xs">{country.n} · {u.r}</div>
        </div>
      ))}
    </div>
  )
}

function ScholarshipResults({ country }) {
  const list = scholarshipsByCountry(country.code)
  if (list.length === 0) {
    return <p className="text-deep-gray text-sm text-center py-10">No open scholarships listed yet for {country.n}. Submit an inquiry and our advisors will check current funding options.</p>
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {list.map((s) => (
        <div key={s.name} className="card rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="iconify text-gold" data-icon="lucide:award" data-width="14"></span>
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-gold">{s.coverage}</span>
          </div>
          <h3 className="text-warm-white text-sm font-medium mb-1">{s.name}</h3>
          <div className="text-warm-gray text-xs">{s.level} · {country.n}</div>
        </div>
      ))}
    </div>
  )
}
