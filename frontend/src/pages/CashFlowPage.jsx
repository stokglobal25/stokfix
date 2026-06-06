import { useState, useEffect } from 'react';
import api from '../api';
import { Plus, X, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const KATEGORI = ['Modal Beli', 'Sewa', 'Operasional', 'Listrik/Net', 'Belanja Stok', 'Penjualan HP', 'Servis', 'Aksesoris'];

export default function CashFlowPage() {
  const [txs, setTxs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('semua');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ tipe: 'pemasukan', kategori: 'Penjualan HP', deskripsi: '', jumlah: '', tanggal: new Date().toISOString().split('T')[0] });
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'keuangan';

  const fetch = async () => {
    try {
      const p = {};
      if (tab !== 'semua') p.tipe = tab;
      const [txRes, sumRes] = await Promise.all([api.get('/cash-flow', { params: p }), api.get('/cash-flow/summary')]);
      setTxs(txRes.data);
      setSummary(sumRes.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [tab]);

  const f = (n) => 'Rp ' + (n || 0).toLocaleString('id-ID');
  const fd = (d) => d?.split('T')[0] || d;

  const handleSubmit = async () => {
    try {
      await api.post('/cash-flow', { ...form, jumlah: parseInt(form.jumlah) });
      setShowModal(false);
      setForm({ tipe: 'pemasukan', kategori: 'Penjualan HP', deskripsi: '', jumlah: '', tanggal: new Date().toISOString().split('T')[0] });
      fetch();
    } catch (e) { alert('Gagal'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus transaksi?')) return;
    try { await api.delete(`/cash-flow/${id}`); fetch(); } catch (e) { alert('Gagal hapus'); }
  };

  const tabs = [
    { key: 'semua', label: 'Semua' }, { key: 'pemasukan', label: 'Masuk' }, { key: 'pengeluaran', label: 'Keluar' },
  ];

  if (loading) return <div className="flex justify-center pt-12"><div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-3">
      {summary && (
        <div className="grid grid-cols-3 gap-2">
          <div className="neumo-sm p-2.5 text-center">
            <p className="text-[10px]" style={{ color: '#a0a0b0' }}>Masuk</p>
            <p className="text-xs font-bold mt-0.5" style={{ color: '#4caf50' }}>{f(summary.total_masuk)}</p>
          </div>
          <div className="neumo-sm p-2.5 text-center">
            <p className="text-[10px]" style={{ color: '#a0a0b0' }}>Keluar</p>
            <p className="text-xs font-bold mt-0.5" style={{ color: '#f44336' }}>{f(summary.total_keluar)}</p>
          </div>
          <div className="neumo-sm p-2.5 text-center">
            <p className="text-[10px]" style={{ color: '#a0a0b0' }}>Saldo</p>
            <p className="text-xs font-bold mt-0.5" style={{ color: (summary.saldo || 0) >= 0 ? '#4caf50' : '#f44336' }}>{f(summary.saldo)}</p>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${tab === t.key ? 'text-bg-primary' : 'text-text-secondary'}`}
            style={tab === t.key ? { background: '#4fc3f7', color: '#1a1a2e' } : {}}>
            {t.label}
          </button>
        ))}
        {canEdit && (
          <button onClick={() => setShowModal(true)} className="ml-auto p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #4fc3f7, #29b6f6)' }}>
            <Plus size={18} style={{ color: '#1a1a2e' }} />
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        {txs.length === 0 ? (
          <div className="neumo p-6 text-center">
            <Wallet size={32} className="mx-auto mb-2" style={{ color: 'rgba(160,160,176,0.3)' }} />
            <p className="text-sm" style={{ color: '#a0a0b0' }}>Belum ada transaksi</p>
          </div>
        ) : txs.map((tx) => (
          <div key={tx.id} className="neumo-sm p-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl" style={{ background: tx.tipe === 'pemasukan' ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)' }}>
                {tx.tipe === 'pemasukan' ? <TrendingUp size={16} style={{ color: '#4caf50' }} /> : <TrendingDown size={16} style={{ color: '#f44336' }} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: '#e0e0e0' }}>{tx.deskripsi}</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#a0a0b0' }}>{tx.kategori} • {fd(tx.tanggal)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-sm" style={{ color: tx.tipe === 'pemasukan' ? '#4caf50' : '#f44336' }}>
                  {tx.tipe === 'pemasukan' ? '+' : '-'}{f(tx.jumlah)}
                </p>
                {canEdit && <button onClick={() => handleDelete(tx.id)} className="text-[10px] mt-0.5" style={{ color: 'rgba(244,67,54,0.6)' }}>hapus</button>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 modal-overlay flex items-end sm:items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5" style={{ background: '#1e2a4a' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold" style={{ color: '#e0e0e0' }}>Transaksi Baru</h2>
              <button onClick={() => setShowModal(false)} className="p-1" style={{ color: '#a0a0b0' }}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <button onClick={() => setForm({...form, tipe: 'pemasukan'})}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium ${form.tipe === 'pemasukan' ? '' : 'text-text-secondary'}`}
                  style={form.tipe === 'pemasukan' ? { background: 'rgba(76,175,80,0.2)', color: '#4caf50' } : {}}>Pemasukan</button>
                <button onClick={() => setForm({...form, tipe: 'pengeluaran'})}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium ${form.tipe === 'pengeluaran' ? '' : 'text-text-secondary'}`}
                  style={form.tipe === 'pengeluaran' ? { background: 'rgba(244,67,54,0.2)', color: '#f44336' } : {}}>Pengeluaran</button>
              </div>
              <select className="neumo-input" value={form.kategori} onChange={(e) => setForm({...form, kategori: e.target.value})}>
                {KATEGORI.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
              <input className="neumo-input" placeholder="Deskripsi" value={form.deskripsi} onChange={(e) => setForm({...form, deskripsi: e.target.value})} />
              <input className="neumo-input" placeholder="Jumlah (Rp)" type="number" value={form.jumlah} onChange={(e) => setForm({...form, jumlah: e.target.value})} />
              <input className="neumo-input" type="date" value={form.tanggal} onChange={(e) => setForm({...form, tanggal: e.target.value})} />
              <button onClick={handleSubmit} className="w-full py-3 font-semibold rounded-xl" style={{ background: 'linear-gradient(135deg, #4fc3f7, #29b6f6)', color: '#1a1a2e' }}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
