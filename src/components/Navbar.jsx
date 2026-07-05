import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, profile, isAdmin, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const initials = profile?.first_name ? profile.first_name[0].toUpperCase() : 'G'

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-[rgba(17,17,17,0.85)] backdrop-blur-2xl border-b border-[rgba(201,168,76,0.12)]">
      <div className="max-w-[1400px] mx-auto w-full h-full px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-crimson flex items-center justify-center font-display font-black text-gold text-sm border border-gold/20">Z</div>
          <div className="hidden sm:block">
            <div className="font-display font-bold text-[13px] tracking-[0.08em] text-warm-white leading-none">ZACO GLOBAL SCHOLARS</div>
            <div className="text-[7px] tracking-[0.25em] text-gold/60 uppercase leading-none mt-0.5">Dream Beyond Borders</div>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          <Link to="/#services" className="text-[11px] font-medium uppercase tracking-[0.1em] text-warm-gray hover:text-warm-white transition-colors">Services</Link>
          <Link to="/explore" className="text-[11px] font-medium uppercase tracking-[0.1em] text-warm-gray hover:text-warm-white transition-colors">Explore</Link>
          <Link to="/#contact" className="text-[11px] font-medium uppercase tracking-[0.1em] text-warm-gray hover:text-warm-white transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-3">
          {!user && (
            <>
              <Link to="/login" className="hidden sm:inline-block text-[11px] font-medium uppercase tracking-[0.1em] text-warm-gray hover:text-warm-white py-2 px-3 transition-colors">Sign In</Link>
              <Link to="/register" className="btn-gold text-[10px] font-bold uppercase tracking-[0.15em] py-2.5 px-5 rounded-sm">Get Started</Link>
            </>
          )}
          {user && (
            <div className="flex items-center gap-2">
              <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2 hover:bg-white/[0.03] px-3 py-2 rounded-lg transition-colors">
                <div className="w-7 h-7 rounded-full bg-crimson/20 flex items-center justify-center font-display font-bold text-gold text-[11px]">{initials}</div>
                <span className="text-sm font-medium text-warm-white hidden sm:inline">{profile?.first_name || 'Account'}</span>
              </Link>
              <button onClick={handleSignOut} className="text-[10px] uppercase tracking-wider text-deep-gray hover:text-dark-red transition-colors hidden sm:block">Sign out</button>
            </div>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-warm-white p-2">
            <span className="iconify" data-icon="lucide:menu" data-width="20"></span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[rgba(201,168,76,0.08)] bg-obsidian/95 backdrop-blur-xl">
          <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col gap-3">
            <Link to="/#services" onClick={() => setMobileOpen(false)} className="text-warm-gray text-sm py-2">Services</Link>
            <Link to="/explore" onClick={() => setMobileOpen(false)} className="text-warm-gray text-sm py-2">Explore</Link>
            <Link to="/#contact" onClick={() => setMobileOpen(false)} className="text-warm-gray text-sm py-2">Contact</Link>
            {!user && <Link to="/login" onClick={() => setMobileOpen(false)} className="text-warm-gray text-sm py-2">Sign In</Link>}
          </div>
        </div>
      )}
    </nav>
  )
}
