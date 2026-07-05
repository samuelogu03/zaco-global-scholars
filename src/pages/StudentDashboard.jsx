import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { countries } from '../data/countries'
import { Link } from 'react-router-dom'

const TABS = ['Profile', 'Documents', 'Inquiries', 'Applications', 'Payments']

export default function StudentDashboard() {
  const [tab, setTab] = useState('Profile')

  return (
    <div className="min-h-screen bg-obsidian">
      <Navbar />
      <div className="pt-28 max-w-[1100px] mx-auto px-6 pb-24">
        <h1 className="font-display font-bold text-3xl text-warm-white mb-2">Your Zaco Passport</h1>
        <p className="text-deep-gray text-sm mb-8">Track your journey from inquiry to arrival.</p>

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

        {tab === 'Profile' && <ProfileTab />}
        {tab === 'Documents' && <DocumentsTab />}
        {tab === 'Inquiries' && <InquiriesTab />}
        {tab === 'Applications' && <ApplicationsTab />}
        {tab === 'Payments' && <PaymentsTab />}
      </div>
    </div>
  )
}

function ProfileTab() {
  const { profile, refreshProfile } = useAuth()
  const [form, setForm] = useState({ first_name: '', last_name: '', country: '', phone: '' })
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        country: profile.country || '',
        phone: profile.phone || ''
      })
    }
  }, [profile])

  async function save(e) {
    e.preventDefault()
    setStatus('saving')
    const { error } = await supabase.from('profiles').update(form).eq('id', profile.id)
    setStatus(error ? 'error' : 'ok')
    if (!error) refreshProfile()
    setTimeout(() => setStatus('idle'), 2500)
  }

  if (!profile) return <p className="text-deep-gray text-sm">Loading profile...</p>

  return (
    <div className="max-w-xl bg-surface border border-[rgba(201,168,76,0.1)] rounded-xl p-8">
      <h2 className="font-display font-bold text-lg text-warm-white mb-6">Profile Information</h2>
      <form onSubmit={save} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">First Name</label>
            <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="label-field">Last Name</label>
            <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className="input-field" />
          </div>
        </div>
        <div>
          <label className="label-field">Email</label>
          <input disabled value={profile.email} className="input-field opacity-60 cursor-not-allowed" />
        </div>
        <div>
          <label className="label-field">Phone / WhatsApp</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="label-field">Country</label>
          <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input-field appearance-none cursor-pointer">
            <option value="">Select</option>
            {countries.map((c) => <option key={c.code} value={c.n}>{c.n}</option>)}
          </select>
        </div>
        <button className="btn-gold text-[11px] font-bold uppercase tracking-[0.15em] py-3.5 rounded-sm mt-2">
          {status === 'saving' ? 'Saving...' : 'Save Changes'}
        </button>
        {status === 'ok' && <p className="text-forest text-xs text-center">Profile updated.</p>}
        {status === 'error' && <p className="text-dark-red text-xs text-center">Could not save. Try again.</p>}
      </form>
    </div>
  )
}

function DocumentsTab() {
  const { user } = useAuth()
  const [docs, setDocs] = useState([])
  const [uploading, setUploading] = useState(false)
  const [docType, setDocType] = useState('CV')

  async function loadDocs() {
    const { data } = await supabase.from('documents').select('*').order('uploaded_at', { ascending: false })
    setDocs(data || [])
  }

  useEffect(() => { loadDocs() }, [])

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const path = `${user.id}/${Date.now()}_${file.name}`
    const { error: uploadError } = await supabase.storage.from('documents').upload(path, file)
    if (!uploadError) {
      await supabase.from('documents').insert({
        user_id: user.id,
        file_name: file.name,
        file_path: path,
        doc_type: docType
      })
      loadDocs()
    }
    setUploading(false)
    e.target.value = ''
  }

  async function download(doc) {
    const { data } = await supabase.storage.from('documents').createSignedUrl(doc.file_path, 60)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  async function remove(doc) {
    await supabase.storage.from('documents').remove([doc.file_path])
    await supabase.from('documents').delete().eq('id', doc.id)
    loadDocs()
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-surface border border-[rgba(201,168,76,0.1)] rounded-xl p-8 mb-6">
        <h2 className="font-display font-bold text-lg text-warm-white mb-4">Upload a Document</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <select value={docType} onChange={(e) => setDocType(e.target.value)} className="input-field sm:max-w-[180px] appearance-none cursor-pointer">
            <option>CV</option>
            <option>SOP</option>
            <option>Transcript</option>
            <option>Passport</option>
            <option>Recommendation Letter</option>
            <option>Other</option>
          </select>
          <label className="btn-gold text-[11px] font-bold uppercase tracking-[0.15em] py-3 px-6 rounded-sm cursor-pointer text-center">
            {uploading ? 'Uploading...' : 'Choose File'}
            <input type="file" onChange={handleUpload} disabled={uploading} className="hidden" />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {docs.length === 0 && <p className="text-deep-gray text-sm text-center py-8">No documents uploaded yet.</p>}
        {docs.map((d) => (
          <div key={d.id} className="card rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="iconify text-gold" data-icon="lucide:file-text" data-width="18"></span>
              <div>
                <div className="text-warm-white text-sm">{d.file_name}</div>
                <div className="text-deep-gray text-[10px] uppercase tracking-wider">{d.doc_type} · {new Date(d.uploaded_at).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => download(d)} className="text-gold text-[10px] uppercase tracking-wider hover:underline">View</button>
              <button onClick={() => remove(d)} className="text-dark-red/70 text-[10px] uppercase tracking-wider hover:text-dark-red">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function InquiriesTab() {
  const [inquiries, setInquiries] = useState([])

  async function load() {
    const { data } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false })
    setInquiries(data || [])
  }
  useEffect(() => { load() }, [])

  async function cancel(id) {
    await supabase.from('inquiries').update({ status: 'cancelled' }).eq('id', id)
    load()
  }

  return (
    <div className="max-w-2xl">
      {inquiries.length === 0 && (
        <div className="text-center py-10">
          <p className="text-deep-gray text-sm mb-4">No inquiries yet.</p>
          <Link to="/#inquiry" className="btn-gold text-[10px] font-bold uppercase tracking-[0.15em] py-3 px-6 rounded-sm inline-block">New Inquiry</Link>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {inquiries.map((i) => (
          <div key={i.id} className="card rounded-lg p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-warm-white text-sm font-medium">{i.service}</div>
                <div className="text-deep-gray text-[10px] mt-0.5">{i.destination || 'No destination'} · {new Date(i.created_at).toLocaleDateString()}</div>
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded ${i.status === 'cancelled' ? 'bg-dark-red/10 text-dark-red' : 'bg-gold/10 text-gold'}`}>{i.status.replace('_', ' ')}</span>
            </div>
            {i.message && <p className="text-warm-gray text-xs mt-2">{i.message}</p>}
            {i.status !== 'cancelled' && (
              <button onClick={() => cancel(i.id)} className="text-[10px] text-dark-red/60 hover:text-dark-red transition-colors mt-3">Cancel this inquiry</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const APPLICATION_STEPS = ['applied', 'under_review', 'admitted', 'visa_processing', 'visa_approved', 'arrived']

function ApplicationsTab() {
  const [apps, setApps] = useState([])

  useEffect(() => {
    supabase.from('applications').select('*').order('created_at', { ascending: false }).then(({ data }) => setApps(data || []))
  }, [])

  if (apps.length === 0) {
    return <p className="text-deep-gray text-sm text-center py-10">No applications tracked yet. Once our advisors submit an application on your behalf, it will appear here.</p>
  }

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      {apps.map((a) => {
        const stepIndex = a.status === 'rejected' ? -1 : APPLICATION_STEPS.indexOf(a.status)
        return (
          <div key={a.id} className="card rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-warm-white font-medium">{a.university}</div>
                <div className="text-warm-gray text-xs">{a.program} · {a.country}</div>
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded ${a.status === 'rejected' ? 'bg-dark-red/10 text-dark-red' : 'bg-forest/10 text-forest'}`}>
                {a.status.replace('_', ' ')}
              </span>
            </div>
            {a.status !== 'rejected' && (
              <div className="flex items-center gap-1">
                {APPLICATION_STEPS.map((s, idx) => (
                  <div key={s} className={`h-1.5 flex-1 rounded-full ${idx <= stepIndex ? 'bg-gold' : 'bg-white/[0.06]'}`} />
                ))}
              </div>
            )}
            {a.notes && <p className="text-warm-gray text-xs mt-3">{a.notes}</p>}
          </div>
        )
      })}
    </div>
  )
}

function PaymentsTab() {
  const [payments, setPayments] = useState([])

  useEffect(() => {
    supabase.from('payments').select('*').order('created_at', { ascending: false }).then(({ data }) => setPayments(data || []))
  }, [])

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-lg text-warm-white">Payment History</h2>
        <Link to="/payment" className="btn-gold text-[10px] font-bold uppercase tracking-[0.15em] py-2.5 px-5 rounded-sm">Make a Payment</Link>
      </div>
      {payments.length === 0 && <p className="text-deep-gray text-sm text-center py-10">No payment records yet.</p>}
      <div className="flex flex-col gap-3">
        {payments.map((p) => (
          <div key={p.id} className="card rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="text-warm-white text-sm">{p.purpose}</div>
              <div className="text-deep-gray text-[10px]">Ref: {p.reference} · {new Date(p.created_at).toLocaleDateString()}</div>
            </div>
            <div className="text-right">
              <div className="text-gold text-sm font-medium">{p.currency} {p.amount}</div>
              <span className={`text-[9px] uppercase tracking-wider ${p.status === 'confirmed' ? 'text-forest' : p.status === 'rejected' ? 'text-dark-red' : 'text-gold'}`}>{p.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
