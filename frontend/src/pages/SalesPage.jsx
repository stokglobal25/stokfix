import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Plus, X, ShoppingCart, Trash2 } from 'lucide-react';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nama_barang: '', jumlah: 1, harga: '', tipe_pembayaran: 'Tunai', catatan: '' });
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'kasir';

  const fetchSales = async () => {
    try { const r = await api.get('/sales'); setSales(r.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchSales(); }, []);

  const f = (n) => 'Rp ' + (n || 0).toLocaleString('id-ID');
  const fd = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

  const handleSubmit = async () => {
    try {
      await api.post('/sales', { ...form, jumlah: parseInt(form.jumlah), harga: parseInt(form.harga) });
      setShowModal(false);
      setForm({ nama_barang: '', jumlah: 1, harga: '', tipe_pembayaran: 'Tunai', catatan: '' });
      fetchSales();
    } catch (e) { alert('Gagal'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus penjualan?')) return;
    try { await api.delete(`/sales/${id}`); fetchSales(); } catch (e) { alert('Gagal hapus'); }
  };

  const total = sales.reduce((s, x) => s + x.harga, 0);

  if (loading) return <div className="flex justify-center pt-12"><div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="neumo-sm p-3 flex-1">
          <p className="text-xs" style={{ color: '#a0a0b0' }}>Total Penjualan</p>
          <p className="text-lg font-bold" style={{ color: '#4caf50' }}>{f(total)}</p>
        </div>
        {canEdit && (
          <button onClick={() => setShowModal(true)} className="ml-2 p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #4fc3f7, #29b6f6)' }}>
            <Plus size={20} style={{ color: '#1a1a2e' }} />
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        {sales.length === 0 ? (
          <div className="neumo p-6 text-center">
            <ShoppingCart size={32} className="mx-auto mb-2" style={{ color: 'rgba(160,160,176,0.3)' }} />
            <p className="text-sm" style={{ color: '#a0a0b0' }}>Belum ada penjualan</p>
          </div>
        ) : sales.map((s) => (
          <div key={s.id} className="neumo-sm p-3">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm" style={{ color: '#e0e0e0' }}>{s.nama_barang}</h3>
                <p className="text-xs mt-0.5" style={{ color: '#a0a0b0' }}>{s.tipe_pembayaran} • {fd(s.tanggal)}</p>
                {s.catatan && <p className="text-[10px] mt-0.5" style={{ color: 'rgba(160,160,176,0.6)' }}>{s.catatan}</p>}
              </div>
              <div className="text-right shrink-0 flex items-center gap-2">
                <div>
                  <p className="font-bold text-sm" style={{ color: '#4caf50' }}>{f(s.harga)}</p>
                  <p className="text-[10px]" style={{ color: '#a0a0b0' }}>x{s.jumlah}</p>
                </div>
                {canEdit && <button onClick={() => handleDelete(s.id)} className="p-1.5 neumo-sm"><Trash2 size={12} style={{ color: '#f44336' }} /></button>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 modal-overlay flex items-end sm:items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5" style={{ background: '#1e2a4a' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold" style={{ color: '#e0e0e0' }}>Catat Penjualan</h2>
              <button onClick={() => setShowModal(false)} className="p-1" style={{ color: '#a0a0b0' }}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input className="neumo-input" placeholder="Nama Barang" value={form.nama_barang} onChange={(e) => setForm({...form, nama_barang: e.target.value})} />
              <div className="grid grid-cols-2 gap-2">
                <input className="neumo-input" placeholder="Jumlah" type="number" min="1" value={form.jumlah} onChange={(e) => setForm({...form, jumlah: e.target.value})} />
                <input className="neumo-input" placeholder="Harga (Rp)" type="number" value={form.harga} onChange={(e) => setForm({...form, harga: e.target.value})} />
              </div>
              <select className="neumo-input" value={form.tipe_pembayaran} onChange={(e) => setForm({...form, tipe_pembayaran: e.target.value})}>
                <option value="Tunai">Tunai</option>
                <option value="Transfer">Transfer</option>
                <option value="Kredit">Kredit</option>
              </select>
              <input className="neumo-input" placeholder="Catatan (opsional)" value={form.catatan} onChange={(e) => setForm({...form, catatan: e.target.value})} />
              <button onClick={handleSubmit} className="w-full py-3 font-semibold rounded-xl" style={{ background: 'linear-gradient(135deg, #4fc3f7, #29b6f6)', color: '#1a1a2e' }}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
