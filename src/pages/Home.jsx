import { Link } from 'react-router-dom'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabaseClient'

const services = [
  { icon: 'lucide:graduation-cap', title: 'Study Abroad', desc: "Undergraduate, Master's, PhD, Diploma — full admission support to top universities worldwide." },
  { icon: 'lucide:flask-conical', title: 'Research & Publications', desc: 'Supervisor matching, research proposals, journal publications, and conference papers.' },
  { icon: 'lucide:award', title: 'Scholarships', desc: 'Fully funded, partial, graduate assistantships — we match you with funding opportunities.' },
  { icon: 'lucide:file-text', title: 'Documents', desc: 'CV for study or job, SOP, Study Plan, LOE, Recommendation Letters — professionally crafted.' },
  { icon: 'lucide:stamp', title: 'Visa Services', desc: 'Student visa, study permit, dependent visa, work permit — complete processing support.' },
  { icon: 'lucide:briefcase', title: 'Career Services', desc: 'Work abroad, CV review, LinkedIn optimization, interview coaching, and job placement.' }
]

const successStories = [
  { tag: 'Admission', tagIcon: 'lucide:check-circle', textCls: 'text-forest', borderCls: 'border-forest', title: 'University of Regina', sub: "MSc Computer Science · Canada", who: 'Adebayo O. · Nigeria' },
  { tag: 'Scholarship', tagIcon: 'lucide:award', textCls: 'text-gold', borderCls: 'border-gold', title: 'University of Auckland', sub: 'PhD Engineering · New Zealand', who: 'Chidinma I. · Nigeria' },
  { tag: 'Visa Approved', tagIcon: 'lucide:check-circle', textCls: 'text-forest', borderCls: 'border-forest', title: 'TU Munich', sub: 'MSc Data Science · Germany', who: 'Musa K. · Kenya' },
  { tag: 'Publication', tagIcon: 'lucide:file-check', textCls: 'text-gold', borderCls: 'border-gold', title: 'IEEE Conference Paper', sub: 'Cybersecurity Research', who: 'Maria S. · Philippines' }
]

export default function Home() {
  const [form, setForm] = useState({ full_name: '', email: '', whatsapp: '', service: '', destination: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | ok | error

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function submitInquiry(e) {
    e.preventDefault()
    setStatus('sending')
    const { error } = await supabase.from('inquiries').insert({
      full_name: form.full_name,
      email: form.email,
      whatsapp: form.whatsapp,
      service: form.service,
      destination: form.destination,
      message: form.message,
      status: 'pending'
    })
    if (error) {
      console.error(error)
      setStatus('error')
    } else {
      setStatus('ok')
      setForm({ full_name: '', email: '', whatsapp: '', service: '', destination: '', message: '' })
    }
  }

  return (
    <div className="min-h-screen bg-obsidian overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 py-20 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col gap-7">
              <div className="flex items-center gap-4">
                <div className="w-10 h-px bg-gradient-to-r from-gold to-transparent" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold/80">International Education & Global Mobility</span>
              </div>
              <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-[3.5rem] lg:text-[4rem] leading-[0.92] tracking-tight text-warm-white">
                Where Your<br />Global Journey<br /><span className="gold-text">Begins.</span>
              </h1>
              <p className="text-lg md:text-xl font-light leading-relaxed text-warm-gray max-w-xl">
                Study abroad. Win scholarships. Build your research career. Find your future. Everything starts here.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <Link to="/register" className="btn-gold text-[11px] font-bold uppercase tracking-[0.15em] py-4 px-10 rounded-sm inline-flex items-center gap-3">
                  Open Your Zaco Passport <span className="iconify" data-icon="lucide:arrow-right" data-width="15"></span>
                </Link>
                <Link to="/explore" className="text-[11px] font-medium uppercase tracking-[0.15em] py-4 px-8 rounded-sm inline-flex items-center gap-3 border border-[rgba(245,240,232,0.1)] text-warm-white hover:border-warm-white/25 hover:bg-white/[0.03] transition-all">
                  Explore Countries & Universities
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-60 h-60 sm:w-72 sm:h-72 lg:w-[300px] lg:h-[300px] rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(155deg,#14100D 0%,#0A0A0A 50%,#14100D 100%)', border: '1px solid rgba(201,168,76,0.15)', boxShadow: '0 0 80px rgba(201,168,76,0.06)' }}>
                <div className="flex flex-col items-center gap-1">
                  <span className="font-display font-black text-7xl md:text-8xl text-gold leading-none">Z</span>
                  <span className="font-display font-bold text-[10px] tracking-[0.35em] uppercase text-warm-white mt-1">ZACO</span>
                  <span className="font-display text-[7px] tracking-[0.4em] uppercase text-gold/60">Global Scholars</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="gold-line max-w-[200px] mx-auto" />

      {/* SERVICES */}
      <section id="services" className="relative py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold/70">What We Offer</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight leading-[0.95] text-warm-white mt-4">Everything You Need.<br /><span className="text-warm-gray">One Platform.</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <div key={s.title} className="card rounded-lg p-7">
                <div className="w-10 h-10 rounded-lg bg-crimson/10 border border-crimson/20 flex items-center justify-center mb-4">
                  <span className="iconify text-gold" data-icon={s.icon} data-width="18"></span>
                </div>
                <h3 className="font-display font-bold text-lg text-warm-white mb-2">{s.title}</h3>
                <p className="text-warm-gray text-sm font-light leading-relaxed mb-5">{s.desc}</p>
                <a href="#inquiry" className="btn-outline-gold text-[9px] font-bold uppercase tracking-[0.15em] py-2.5 px-5 rounded-sm inline-flex items-center gap-2">
                  Inquire <span className="iconify" data-icon="lucide:arrow-up-right" data-width="11"></span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-line max-w-[200px] mx-auto" />

      {/* EXPLORE CTA (countries/scholarships not shown here, only linked) */}
      <section className="relative py-24">
        <div className="max-w-[1000px] mx-auto px-6 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold/70">25+ Countries · 1,000+ Universities</span>
          <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight text-warm-white mt-4 mb-6">Not sure where to start?</h2>
          <p className="text-warm-gray font-light text-lg mb-8 max-w-lg mx-auto">Search any country to see universities there, then check what scholarships are open for it.</p>
          <Link to="/explore" className="btn-gold text-[11px] font-bold uppercase tracking-[0.15em] py-4 px-10 rounded-sm inline-flex items-center gap-3">
            Open Country Explorer <span className="iconify" data-icon="lucide:search" data-width="15"></span>
          </Link>
        </div>
      </section>

      <div className="gold-line max-w-[200px] mx-auto" />

      {/* SUCCESS WALL */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold/70">Real Results</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight text-warm-white mt-4">The Success Wall.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {successStories.map((s) => (
              <div key={s.title} className={`rounded-lg p-5 bg-white/[0.02] border-l-2 ${s.borderCls}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`iconify ${s.textCls}`} data-icon={s.tagIcon} data-width="14"></span>
                  <span className={`text-[9px] font-bold uppercase tracking-[0.15em] ${s.textCls}`}>{s.tag}</span>
                </div>
                <div className="text-warm-white font-medium text-sm">{s.title}</div>
                <div className="text-warm-gray text-xs">{s.sub}</div>
                <div className="text-deep-gray text-[10px] mt-2">{s.who}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="relative py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="rounded-xl p-10 md:p-14 flex flex-col md:flex-row items-center gap-8 md:gap-14" style={{ background: 'linear-gradient(135deg,rgba(139,26,26,0.08),rgba(201,168,76,0.04))', border: '1px solid rgba(201,168,76,0.15)' }}>
            <div className="w-20 h-20 rounded-full bg-crimson/10 border border-crimson/20 flex items-center justify-center flex-shrink-0">
              <span className="iconify text-gold" data-icon="lucide:shield-check" data-width="36"></span>
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-warm-white mb-2">100% Refund Guarantee</h2>
              <p className="text-warm-gray font-light text-base leading-relaxed">No admission? Full refund. No questions asked.</p>
            </div>
            <span className="font-display font-black text-5xl md:text-7xl text-gold/15 leading-none flex-shrink-0">100%</span>
          </div>
        </div>
      </section>

      {/* INQUIRY FORM */}
      <section id="inquiry" className="relative py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold/70">Start Here</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight text-warm-white mt-4">Begin Your Journey.</h2>
            <p className="text-warm-gray font-light text-lg mt-4 max-w-lg mx-auto">No account needed. Tell us about your plans and we'll respond within 2 hours.</p>
          </div>
          <div className="max-w-2xl mx-auto bg-surface border border-[rgba(201,168,76,0.1)] rounded-xl p-8 md:p-10">
            <form onSubmit={submitInquiry} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label-field">Full Name *</label>
                  <input required value={form.full_name} onChange={(e) => update('full_name', e.target.value)} className="input-field" placeholder="Your name" />
                </div>
                <div>
                  <label className="label-field">Email *</label>
                  <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="input-field" placeholder="you@email.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label-field">WhatsApp</label>
                  <input value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} className="input-field" placeholder="+1 XXX XXX XXXX" />
                </div>
                <div>
                  <label className="label-field">Service *</label>
                  <select required value={form.service} onChange={(e) => update('service', e.target.value)} className="input-field appearance-none cursor-pointer">
                    <option value="">Select</option>
                    <option>Study Abroad</option>
                    <option>Research & Publications</option>
                    <option>Scholarships</option>
                    <option>Documents (CV / SOP)</option>
                    <option>Visa Services</option>
                    <option>Career Services</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label-field">Destination</label>
                <input value={form.destination} onChange={(e) => update('destination', e.target.value)} className="input-field" placeholder="e.g. Canada, UK, Germany..." />
              </div>
              <div>
                <label className="label-field">Message</label>
                <textarea rows="3" value={form.message} onChange={(e) => update('message', e.target.value)} className="input-field resize-none" placeholder="Tell us about your plans..." />
              </div>
              <button disabled={status === 'sending'} type="submit" className="btn-gold text-[11px] font-bold uppercase tracking-[0.15em] py-4 rounded-sm w-full flex items-center justify-center gap-3 disabled:opacity-60">
                {status === 'sending' ? 'Sending...' : 'Submit Inquiry'}
                <span className="iconify" data-icon="lucide:send" data-width="14"></span>
              </button>
              {status === 'ok' && (
                <div className="flex items-center gap-2 bg-forest/10 border border-forest/20 px-4 py-3 text-sm text-forest rounded-lg">
                  <span className="iconify" data-icon="lucide:check-circle" data-width="16"></span>
                  <span>Inquiry submitted. We'll respond within 2 hours.</span>
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-2 bg-dark-red/10 border border-dark-red/20 px-4 py-3 text-sm text-dark-red rounded-lg">
                  <span className="iconify" data-icon="lucide:alert-circle" data-width="16"></span>
                  <span>Something went wrong. Please try again or WhatsApp us directly.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold/70">Our Offices</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight text-warm-white mt-4">Get in Touch.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            <div className="card rounded-xl p-8">
              <h3 className="font-display font-bold text-lg text-warm-white mb-0.5">🇳🇬 Nigeria</h3>
              <p className="text-gold text-[10px] font-bold uppercase tracking-[0.15em] mb-6">Headquarters</p>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-start gap-3 text-warm-gray"><span className="iconify text-gold mt-0.5" data-icon="lucide:map-pin" data-width="15"></span>Lagos, Nigeria</div>
                <a href="mailto:lagos@zacoglobalscholars.com" className="flex items-start gap-3 text-warm-white hover:opacity-80"><span className="iconify text-gold mt-0.5" data-icon="lucide:mail" data-width="15"></span>lagos@zacoglobalscholars.com</a>
              </div>
            </div>
            <div className="card rounded-xl p-8">
              <h3 className="font-display font-bold text-lg text-warm-white mb-0.5">🇵🇭 Philippines</h3>
              <p className="text-gold text-[10px] font-bold uppercase tracking-[0.15em] mb-6">Asia Branch</p>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-start gap-3 text-warm-gray"><span className="iconify text-gold mt-0.5" data-icon="lucide:map-pin" data-width="15"></span>Manila, Philippines</div>
                <a href="mailto:manila@zacoglobalscholars.com" className="flex items-start gap-3 text-warm-white hover:opacity-80"><span className="iconify text-gold mt-0.5" data-icon="lucide:mail" data-width="15"></span>manila@zacoglobalscholars.com</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
