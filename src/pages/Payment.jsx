import { useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

function makeReference() {
  return 'ZACO-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

export default function Payment() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ purpose: '', amount: '', currency: 'USD' })
  const [reference] = useState(makeReference())
  const [status, setStatus] = useState('idle')

  async function submit(e) {
    e.preventDefault()
    setStatus('saving')
    const { error } = await supabase.from('payments').insert({
      user_id: user.id,
      amount: parseFloat(form.amount),
      currency: form.currency,
      purpose: form.purpose,
      reference,
      status: 'pending'
    })
    if (error) {
      setStatus('error')
    } else {
      setStatus('ok')
      setTimeout(() => navigate('/dashboard'), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-obsidian">
      <Navbar />
      <div className="pt-28 max-w-2xl mx-auto px-6 pb-24">
        <h1 className="font-display font-bold text-3xl text-warm-white mb-2">Make a Payment</h1>
        <p className="text-deep-gray text-sm mb-8">
          Transfer to the account below, then log your payment with the reference code so our team can confirm it.
        </p>

        <div className="passport-card rounded-xl p-6 mb-8" style={{ background: 'linear-gradient(145deg,#1A1510 0%,#0F0D0A 50%,#1A1510 100%)', border: '1px solid rgba(201,168,76,0.2)' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold">Bank Transfer Details</span>
            <span className="text-gold text-[10px] font-bold">Ref: {reference}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><div className="text-deep-gray text-[10px] uppercase">Bank Name</div><div className="text-warm-white">First Bank of Nigeria</div></div>
            <div><div className="text-deep-gray text-[10px] uppercase">Account Name</div><div className="text-warm-white">Zaco Global Scholars Ltd</div></div>
            <div><div className="text-deep-gray text-[10px] uppercase">Account Number</div><div className="text-warm-white">XXXXXXXXXX</div></div>
            <div><div className="text-deep-gray text-[10px] uppercase">SWIFT / BIC</div><div className="text-warm-white">FBNINGLA</div></div>
          </div>
          <p className="text-warm-gray text-xs mt-4">
            Update these details in <code className="text-gold">src/pages/Payment.jsx</code> with your real bank or payment processor info once available.
          </p>
        </div>

        <div className="bg-surface border border-[rgba(201,168,76,0.1)] rounded-xl p-8">
          <h2 className="font-display font-bold text-lg text-warm-white mb-6">Log Your Payment</h2>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
              <label className="label-field">What is this payment for? *</label>
              <select required value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} className="input-field appearance-none cursor-pointer">
                <option value="">Select</option>
                <option>Application Processing Fee</option>
                <option>Document Preparation</option>
                <option>Visa Processing Fee</option>
                <option>Consultation Fee</option>
                <option>Other</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-field">Amount *</label>
                <input required type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="input-field" placeholder="0.00" />
              </div>
              <div>
                <label className="label-field">Currency</label>
                <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="input-field appearance-none cursor-pointer">
                  <option>USD</option>
                  <option>NGN</option>
                  <option>PHP</option>
                  <option>GBP</option>
                  <option>EUR</option>
                </select>
              </div>
            </div>
            <button disabled={status === 'saving'} className="btn-gold text-[11px] font-bold uppercase tracking-[0.15em] py-3.5 rounded-sm mt-2 disabled:opacity-60">
              {status === 'saving' ? 'Saving...' : 'Submit Payment Record'}
            </button>
            {status === 'ok' && <p className="text-forest text-xs text-center">Payment logged. Our team will confirm it shortly.</p>}
            {status === 'error' && <p className="text-dark-red text-xs text-center">Something went wrong. Please try again.</p>}
          </form>
        </div>
      </div>
    </div>
  )
}
