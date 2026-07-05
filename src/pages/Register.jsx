import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { countries } from '../data/countries'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', country: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)
  const [loading, setLoading] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    const { error } = await signUp(form)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setOk(true)
      setTimeout(() => navigate('/login'), 1800)
    }
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 rounded-full bg-crimson flex items-center justify-center font-display font-black text-gold border border-gold/20">Z</div>
          <div>
            <div className="font-display font-bold text-sm tracking-[0.08em] text-warm-white">ZACO GLOBAL SCHOLARS</div>
            <div className="text-[7px] tracking-[0.25em] text-gold/60 uppercase">Dream Beyond Borders</div>
          </div>
        </Link>
        <div className="bg-surface border border-[rgba(201,168,76,0.12)] rounded-xl p-8">
          <h1 className="font-display font-bold text-xl text-warm-white mb-1">Create Your Zaco Passport</h1>
          <p className="text-deep-gray text-xs mb-6">Start your global journey today</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-field">First Name</label>
                <input required value={form.firstName} onChange={(e) => update('firstName', e.target.value)} className="input-field" placeholder="First" />
              </div>
              <div>
                <label className="label-field">Last Name</label>
                <input required value={form.lastName} onChange={(e) => update('lastName', e.target.value)} className="input-field" placeholder="Last" />
              </div>
            </div>
            <div>
              <label className="label-field">Email</label>
              <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="input-field" placeholder="you@email.com" />
            </div>
            <div>
              <label className="label-field">Phone / WhatsApp</label>
              <input value={form.phone} onChange={(e) => update('phone', e.target.value)} className="input-field" placeholder="+1 XXX XXX XXXX" />
            </div>
            <div>
              <label className="label-field">Country</label>
              <select required value={form.country} onChange={(e) => update('country', e.target.value)} className="input-field appearance-none cursor-pointer">
                <option value="">Select your country</option>
                {countries.map((c) => <option key={c.code} value={c.n}>{c.n}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Password</label>
              <input required minLength={6} type="password" value={form.password} onChange={(e) => update('password', e.target.value)} className="input-field" placeholder="Min 6 characters" />
            </div>
            {error && <p className="text-dark-red text-xs text-center">{error}</p>}
            {ok && <p className="text-forest text-xs text-center">Account created! Check your email to confirm, then sign in.</p>}
            <button disabled={loading} type="submit" className="btn-gold text-[11px] font-bold uppercase tracking-[0.15em] py-4 rounded-sm w-full mt-2 disabled:opacity-60">
              {loading ? 'Creating...' : 'Create Your Zaco Passport'}
            </button>
          </form>
          <p className="text-center text-deep-gray text-xs mt-6">
            Already have an account? <Link to="/login" className="text-gold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
