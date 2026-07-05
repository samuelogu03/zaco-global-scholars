import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 rounded-full bg-crimson flex items-center justify-center font-display font-black text-gold border border-gold/20">Z</div>
          <div>
            <div className="font-display font-bold text-sm tracking-[0.08em] text-warm-white">ZACO GLOBAL SCHOLARS</div>
            <div className="text-[7px] tracking-[0.25em] text-gold/60 uppercase">Dream Beyond Borders</div>
          </div>
        </Link>
        <div className="bg-surface border border-[rgba(201,168,76,0.12)] rounded-xl p-8">
          <h1 className="font-display font-bold text-xl text-warm-white mb-1">Welcome Back</h1>
          <p className="text-deep-gray text-xs mb-6">Sign in to your Zaco Passport</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="label-field">Email</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@email.com" />
            </div>
            <div>
              <label className="label-field">Password</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••" />
            </div>
            {error && <p className="text-dark-red text-xs text-center">{error}</p>}
            <button disabled={loading} type="submit" className="btn-gold text-[11px] font-bold uppercase tracking-[0.15em] py-4 rounded-sm w-full mt-2 disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-deep-gray text-xs mt-6">
            Don't have an account? <Link to="/register" className="text-gold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
