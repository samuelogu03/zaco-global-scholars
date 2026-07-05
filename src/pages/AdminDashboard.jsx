import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { supabase } from '../lib/supabaseClient'

const TABS = ['Inquiries', 'Applications', 'Payments', 'Students']

export default function AdminDashboard() {
  const [tab, setTab] = useState('Inquiries')

  return (
    <div className="min-h-screen bg-obsidian">
      <Navbar />
      <div className="pt-28 max-w-[1200px] mx-auto px-6 pb-24">
        <h1 className="font-display font-bold text-3xl text-warm-white mb-2">Admin Console</h1>
        <p className="text-deep-gray text-sm mb-8">Manage inquiries, applications, payments, and students.</p>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-[10px] font-bold uppercase tracking-[0.15em] py-3 px-5 rounded-sm whitespace-nowrap transition-all ${tab === t ? 'btn-gold' : 'btn-outline-gold'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'Inquiries' && <AdminInquiries />}
        {tab === 'Applications' && <AdminApplications />}
        {tab === 'Payments' && <AdminPayments />}
        {tab === 'Students' && <AdminStudents />}
      </div>
    </div>
  )
}

function AdminInquiries() {
  const [rows, setRows] = useState([])

  async function load() {
    const { data } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false })
    setRows(data || [])
  }
  useEffect(() => { load() }, [])

  async function setStatus(id, status) {
    await supabase.from('inquiries').update({ status }).eq('id', id)
    load()
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-deep-gray text-[10px] uppercase tracking-wider border-b border-[rgba(245,240,232,0.08)]">
            <th className="py-3 pr-4">Name</th>
            <th className="py-3 pr-4">Service</th>
            <th className="py-3 pr-4">Destination</th>
            <th className="py-3 pr-4">Contact</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 pr-4">Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-[rgba(245,240,232,0.04)]">
              <td className="py-3 pr-4 text-warm-white">{r.full_name}</td>
              <td className="py-3 pr-4 text-warm-gray">{r.service}</td>
              <td className="py-3 pr-4 text-warm-gray">{r.destination || '—'}</td>
              <td className="py-3 pr-4 text-warm-gray">
                <div>{r.email}</div>
                <div className="text-deep-gray text-xs">{r.whatsapp}</div>
              </td>
              <td className="py-3 pr-4">
                <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} className="bg-surface-2 border border-[rgba(245,240,232,0.08)] text-xs rounded px-2 py-1 text-warm-white">
                  <option value="pending">Pending</option>
                  <option value="in_review">In Review</option>
                  <option value="responded">Responded</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td className="py-3 pr-4 text-deep-gray text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={6} className="text-center text-deep-gray py-10">No inquiries yet.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

function AdminApplications() {
  const [rows, setRows] = useState([])
  const [students, setStudents] = useState([])
  const [form, setForm] = useState({ user_id: '', university: '', country: '', program: '' })

  async function load() {
    const { data } = await supabase.from('applications').select('*').order('created_at', { ascending: false })
    setRows(data || [])
    const { data: profs } = await supabase.from('profiles').select('id, first_name, last_name, email').eq('role', 'student')
    setStudents(profs || [])
  }
  useEffect(() => { load() }, [])

  async function create(e) {
    e.preventDefault()
    if (!form.user_id || !form.university) return
    await supabase.from('applications').insert(form)
    setForm({ user_id: '', university: '', country: '', program: '' })
    load()
  }

  async function setStatus(id, status) {
    await supabase.from('applications').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    load()
  }

  return (
    <div>
      <form onSubmit={create} className="card rounded-lg p-5 mb-6 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
        <div className="sm:col-span-2">
          <label className="label-field">Student</label>
          <select value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} className="input-field appearance-none cursor-pointer">
            <option value="">Select student</option>
            {students.map((s) => <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.email})</option>)}
          </select>
        </div>
        <div>
          <label className="label-field">University</label>
          <input value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="label-field">Country</label>
          <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input-field" />
        </div>
        <div className="flex gap-2">
          <input value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} className="input-field" placeholder="Program" />
          <button className="btn-gold text-[10px] font-bold uppercase px-4 rounded-sm whitespace-nowrap">Add</button>
        </div>
      </form>

      <div className="flex flex-col gap-3">
        {rows.map((a) => (
          <div key={a.id} className="card rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-warm-white text-sm font-medium">{a.university}</div>
              <div className="text-deep-gray text-xs">{a.program} · {a.country}</div>
            </div>
            <select value={a.status} onChange={(e) => setStatus(a.id, e.target.value)} className="bg-surface-2 border border-[rgba(245,240,232,0.08)] text-xs rounded px-2 py-1 text-warm-white">
              <option value="applied">Applied</option>
              <option value="under_review">Under Review</option>
              <option value="admitted">Admitted</option>
              <option value="rejected">Rejected</option>
              <option value="visa_processing">Visa Processing</option>
              <option value="visa_approved">Visa Approved</option>
              <option value="arrived">Arrived</option>
            </select>
          </div>
        ))}
        {rows.length === 0 && <p className="text-deep-gray text-center py-10">No applications tracked yet.</p>}
      </div>
    </div>
  )
}

function AdminPayments() {
  const [rows, setRows] = useState([])

  async function load() {
    const { data } = await supabase.from('payments').select('*').order('created_at', { ascending: false })
    setRows(data || [])
  }
  useEffect(() => { load() }, [])

  async function setStatus(id, status) {
    await supabase.from('payments').update({ status }).eq('id', id)
    load()
  }

  return (
    <div className="flex flex-col gap-3">
      {rows.map((p) => (
        <div key={p.id} className="card rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-warm-white text-sm">{p.purpose}</div>
            <div className="text-deep-gray text-xs">Ref: {p.reference} · {p.currency} {p.amount}</div>
          </div>
          <select value={p.status} onChange={(e) => setStatus(p.id, e.target.value)} className="bg-surface-2 border border-[rgba(245,240,232,0.08)] text-xs rounded px-2 py-1 text-warm-white">
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      ))}
      {rows.length === 0 && <p className="text-deep-gray text-center py-10">No payment records yet.</p>}
    </div>
  )
}

function AdminStudents() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => setRows(data || []))
  }, [])

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-deep-gray text-[10px] uppercase tracking-wider border-b border-[rgba(245,240,232,0.08)]">
            <th className="py-3 pr-4">Name</th>
            <th className="py-3 pr-4">Email</th>
            <th className="py-3 pr-4">Country</th>
            <th className="py-3 pr-4">Role</th>
            <th className="py-3 pr-4">Joined</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-[rgba(245,240,232,0.04)]">
              <td className="py-3 pr-4 text-warm-white">{r.first_name} {r.last_name}</td>
              <td className="py-3 pr-4 text-warm-gray">{r.email}</td>
              <td className="py-3 pr-4 text-warm-gray">{r.country || '—'}</td>
              <td className="py-3 pr-4">
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded ${r.role === 'admin' ? 'bg-crimson/15 text-crimson-light' : 'bg-gold/10 text-gold'}`}>{r.role}</span>
              </td>
              <td className="py-3 pr-4 text-deep-gray text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={5} className="text-center text-deep-gray py-10">No students yet.</td></tr>}
        </tbody>
      </table>
      <p className="text-deep-gray text-xs mt-4">
        To promote a student to admin, run in Supabase SQL Editor:
        <code className="text-gold block mt-1">update public.profiles set role = 'admin' where email = 'their@email.com';</code>
      </p>
    </div>
  )
}
