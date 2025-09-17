import React, { useState, useEffect } from 'react'

const tournamentsData = [
  { id: 1, name: 'PES Mobile Cup 2025', date: '2025-11-08', desc: 'Turnamen komunitas PES Mobile — all platforms' },
  { id: 2, name: 'PES Mobile Community Clash', date: '2025-12-05', desc: 'Open tournament — hadiah menarik' }
]

function TournamentCard({ t, onRegister }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="text-xl font-semibold">{t.name}</h3>
      <p className="text-sm text-gray-600">Tanggal: {t.date}</p>
      <p className="mt-2">{t.desc}</p>
      <button onClick={() => onRegister(t)} className="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Daftar</button>
    </div>
  )
}

export default function App(){
  const [page, setPage] = useState('home')
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [entries, setEntries] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('pes_entries')
    if (saved) setEntries(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('pes_entries', JSON.stringify(entries))
  }, [entries])

  const openRegister = (t) => {
    setSelected(t)
    setPage('register')
    setFeedback(null)
  }

  const submitForm = async (data) => {
    // Save locally
    const entry = {...data, tournament: selected}
    setEntries(prev => [...prev, entry])
    setFeedback('Registrasi berhasil (tersimpan lokal).')

    // Try to send to VITE_FORM_ENDPOINT if provided
    const endpoint = import.meta.env.VITE_FORM_ENDPOINT
    if (endpoint) {
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry)
        })
        setFeedback('Registrasi berhasil dan dikirim ke endpoint.')
      } catch (e) {
        setFeedback('Registrasi disimpan lokal — gagal kirim ke endpoint.')
        console.error(e)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">PES Mobile Tournament</h1>
            <p className="text-sm text-gray-600">Kompetisi mobile untuk komunitas PES</p>
          </div>
          <nav className="space-x-3">
            <button onClick={() => setPage('home')} className="text-sm">Home</button>
            <button onClick={() => setPage('list')} className="text-sm">Daftar Turnamen</button>
            <button onClick={() => { setPage('entries') }} className="text-sm">Daftar Peserta</button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {page === 'home' && (
          <section className="grid gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-3xl font-bold">Selamat datang di PES Mobile Tournament</h2>
              <p className="mt-2 text-gray-700">Ikuti turnamen, daftar sekarang dan menangkan hadiah!</p>
              <div className="mt-4">
                <button onClick={() => setPage('list')} className="px-4 py-2 rounded bg-green-600 text-white">Lihat Turnamen</button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold">Info Cepat</h3>
              <ul className="list-disc list-inside mt-2 text-gray-700">
                <li>Form pendaftaran menyimpan data ke localStorage.</li>
                <li>Untuk mengirim ke Google Sheets / email, set environment variable <code>VITE_FORM_ENDPOINT</code> di Vercel.</li>
              </ul>
            </div>
          </section>
        )}

        {page === 'list' && (
          <section className="grid gap-4">
            <h2 className="text-2xl font-bold">Daftar Turnamen</h2>
            <div className="grid md:grid-cols-2 gap-4 mt-3">
              {tournamentsData.map(t => <TournamentCard key={t.id} t={t} onRegister={openRegister} />)}
            </div>
          </section>
        )}

        {page === 'register' && selected && (
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold">Daftar: {selected.name}</h2>
            <RegistrationForm onSubmit={submitForm} />
            {feedback && <p className="mt-3 text-green-700">{feedback}</p>}
          </section>
        )}

        {page === 'entries' && (
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold">Daftar Peserta (tersimpan lokal)</h2>
            {entries.length === 0 ? <p className="mt-2 text-gray-600">Belum ada pendaftar.</p> : (
              <div className="mt-4">
                {entries.map((e, i) => (
                  <div key={i} className="border-b py-2">
                    <div className="font-semibold">{e.name} — {e.username}</div>
                    <div className="text-sm text-gray-600">{e.phone} • {e.email}</div>
                    <div className="text-xs text-gray-500">Turnamen: {e.tournament?.name}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="text-center text-sm text-gray-500 p-6">© PES Mobile Tournament</footer>
    </div>
  )
}

function RegistrationForm({ onSubmit }) {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    if (!name || !username || !phone) {
      alert('Isi Nama, Username, dan Nomor WA minimal.')
      return
    }
    setSubmitting(true)
    await onSubmit({ name, username, phone, email, createdAt: new Date().toISOString() })
    setName(''); setUsername(''); setPhone(''); setEmail('')
    setSubmitting(false)
  }

  return (
    <form onSubmit={handle} className="mt-4 grid gap-3">
      <label>
        <div className="text-sm">Nama Lengkap</div>
        <input value={name} onChange={e=>setName(e.target.value)} className="w-full border rounded px-3 py-2" />
      </label>
      <label>
        <div className="text-sm">Username PES</div>
        <input value={username} onChange={e=>setUsername(e.target.value)} className="w-full border rounded px-3 py-2" />
      </label>
      <label>
        <div className="text-sm">Nomor WhatsApp</div>
        <input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full border rounded px-3 py-2" />
      </label>
      <label>
        <div className="text-sm">Email (opsional)</div>
        <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
      </label>
      <button type="submit" disabled={submitting} className="mt-2 px-4 py-2 rounded bg-blue-600 text-white">{submitting ? 'Mengirim...' : 'Daftar'}</button>
    </form>
  )
}
