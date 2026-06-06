import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Plus, X, CreditCard, DollarSign } from 'lucide-react';

export default function CreditsPage() {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [payModal, setPayModal] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [form, setForm] = useState({ nama_peminjam: '', status: 'Belum Lunas', deskripsi: '', total: '', sisa: '', jatuh_tempo: '', catatan: '' });
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'keuangan';

  const fetch = async () => {
    try { const r = await api.get('/credits'); setCredits(r.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const f = (n) => 'Rp ' + (n || 0).toLocaleString('id-ID');
  const fd = (d) => d || '';

  const sb = (s) => {
    const m = { 'Lunas': 'rgba(76,175,80,0.2)', 'Sebagian Lunas': 'rgba(255,152,0,0.2)', 'Belum Lunas': 'rgba(244,67,54,0.2)' };
    const c = { 'Lunas': '#4caf50', 'Sebagian Lunas': '#ff9800', 'Belum Lunas': '#f44336' };
    return { background: m[s] || 'rgba(160,160,176,0.2)', color: c[s] || '#a0a0b0' };
  };

  const handleSubmit = async () => {
    try {
      await api.post('/credits', { ...form, total: parseInt(form.total), sisa: form.sisa ? parseInt(form.sisa) : parseInt(form.total) });
      setShowModal(false);
      setForm({ nama_peminjam: '', status: 'Belum Lunas', deskripsi: '', total: '', sisa: '', jatuh_tempo: '', catatan: '' });
      fetch();
    } catch (e) { alert('Gagal'); }
  };

  const handlePay = async () => {
    if (!payModal || !payAmount) return;
    const amt = parseInt(payAmount);
    if (amt <= 0 || amt > payModal.sisa) { alert(`Bayar antara 1 - ${f(payModal.sisa)}`); return; }
    const ns = payModal.sisa - amt;
    const ns2 = ns === 0 ? 'Lunas' : 'Sebagian Lunas';
    try { await api.put(`/credits/${payModal.id}`, { sisa: ns, status: ns2 }); setPayModal(null); setPayAmount(''); fetch(); }
    catch (e) { alert('Gagal bayar'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus kredit?')) return;
    try { await api.delete(`/credits/${id}`); fetch(); } catch (e) { alert('Gagal hapus'); }
  };

  const total = credits.reduce((s, c) => s + c.sisa, 0);

  if (loading) return <div className="flex justify-center pt-12"><div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="neumo-sm p-3 flex-1">
          <p className="text-xs" style={{ color: '#a0a0b0' }}>Total Piutang</p>
          <p className="text-lg font-bold" style={{ color: '#ff9800' }}>{f(total)}</p>
        </div>
        {canEdit && (
          <button onClick={() => setShowModal(true)} className="ml-2 p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #4fc3f7, #29b6f6)' }}>
            <Plus size={20} style={{ color: '#1a1a2e' }} />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {credits.length === 0 ? (
          <div className="neumo p-6 text-center">
            <CreditCard size={32} className="mx-auto mb-2" style={{ color: 'rgba(160,160,176,0.3)' }} />
            <p className="text-sm" style={{ color: '#a0a0b0' }}>Belum ada catatan kredit</p>
          </div>
        ) : credits.map((c) => (
          <div key={c.id} className="neumo-sm p-3">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm" style={{ color: '#e0e0e0' }}>{c.nama_peminjam}</h3>
                  <span className="badge" style={sb(c.status)}>{c.status}</span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: '#a0a0b0' }}>{c.deskripsi}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'rgba(160,160,176,0.6)' }}>Jatuh tempo: {fd(c.jatuh_tempo)}</p>
                {c.catatan && <p className="text-[10px] mt-0.5" style={{ color: 'rgba(160,160,176,0.4)' }}>{c.catatan}</p>}
              </div>
              <div className="text-right shrink-0 ml-3">
                <p className="font-bold text-sm" style={{ color: '#e0e0e0' }}>{f(c.total)}</p>
                <p className="text-xs" style={{ color: '#ff9800' }}>Sisa: {f(c.sisa)}</p>
                {canEdit && c.sisa > 0 && <button onClick={() => setPayModal(c)} className="text-xs font-medium mt-1" style={{ color: '#4fc3f7' }}>Bayar</button>}
                {canEdit && <button onClick={() => handleDelete(c.id)} className="text-[10px] ml-2" style={{ color: 'rgba(244,67,54,0.6)' }}>hapus</button>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 modal-overlay flex items-end sm:items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 max-h-[85vh] overflow-y-auto" style={{ background: '#1e2a4a' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold" style={{ color: '#e0e0e0' }}>Tambah Kredit</h2>
              <button onClick={() => setShowModal(false)} className="p-1" style={{ color: '#a0a0b0' }}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input className="neumo-input" placeholder="Nama Peminjam" value={form.nama_peminjam} onChange={(e) => setForm({...form, nama_peminjam: e.target.value})} />
              <input className="neumo-input" placeholder="Deskripsi" value={form.deskripsi} onChange={(e) => setForm({...form, deskripsi: e.target.value})} />
              <div className="grid grid-cols-2 gap-2">
                <input className="neumo-input" placeholder="Total (Rp)" type="number" value={form.total} onChange={(e) => setForm({...form, total: e.target.value})} />
                <input className="neumo-input" placeholder="Sisa (Rp)" type="number" value={form.sisa} onChange={(e) => setForm({...form, sisa: e.target.value})} />
              </div>
              <select className="neumo-input" value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}>
                <option value="Belum Lunas">Belum Lunas</option>
                <option value="Sebagian Lunas">Sebagian Lunas</option>
              </select>
              <input className="neumo-input" type="date" value={form.jatuh_tempo} onChange={(e) => setForm({...form, jatuh_tempo: e.target.value})} />
              <input className="neumo-input" placeholder="Catatan (opsional)" value={form.catatan} onChange={(e) => setForm({...form, catatan: e.target.value})} />
              <button onClick={handleSubmit} className="w-full py-3 font-semibold rounded-xl" style={{ background: 'linear-gradient(135deg, #4fc3f7, #29b6f6)', color: '#1a1a2e' }}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {payModal && (
        <div className="fixed inset-0 z-50 modal-overlay flex items-end sm:items-center justify-center" onClick={() => setPayModal(null)}>
          <div className="w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5" style={{ background: '#1e2a4a' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold" style={{ color: '#e0e0e0' }}>Bayar — {payModal.nama_peminjam}</h2>
              <button onClick={() => setPayModal(null)} className="p-1" style={{ color: '#a0a0b0' }}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div className="neumo-sm p-3 text-center">
                <p className="text-xs" style={{ color: '#a0a0b0' }}>Sisa Piutang</p>
                <p className="text-xl font-bold" style={{ color: '#ff9800' }}>{f(payModal.sisa)}</p>
              </div>
              <input className="neumo-input" placeholder="Jumlah bayar (Rp)" type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
              <button onClick={handlePay} className="w-full py-3 font-semibold rounded-xl flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #4fc3f7, #29b6f6)', color: '#1a1a2e' }}>
                <DollarSign size={18} /> Bayar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
