import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Edit2, Trash2, X, Smartphone } from 'lucide-react';

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ nama: '', spek: '', imei: '', harga_modal: '', harga_jual: '', catatan: '' });
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'stok';

  const fetchItems = async (q) => {
    try {
      const params = q ? { q } : {};
      const res = await api.get('/inventory', { params });
      setItems(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchItems(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const openAdd = () => {
    setEditItem(null);
    setForm({ nama: '', spek: '', imei: '', harga_modal: '', harga_jual: '', catatan: '' });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      nama: item.nama, spek: item.spek || '', imei: item.imei,
      harga_modal: String(item.harga_modal), harga_jual: String(item.harga_jual),
      catatan: item.catatan || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const p = {
      nama: form.nama, spek: form.spek, imei: form.imei,
      harga_modal: parseInt(form.harga_modal), harga_jual: parseInt(form.harga_jual),
      catatan: form.catatan || null,
    };
    try {
      if (editItem) await api.put(`/inventory/${editItem.id}`, p);
      else await api.post('/inventory', p);
      setShowModal(false);
      fetchItems(search);
    } catch (e) { alert(e.response?.data?.detail || 'Gagal'); }
  };

  const handleDelete = async (id, nama) => {
    if (!confirm(`Hapus ${nama}?`)) return;
    try { await api.delete(`/inventory/${id}`); fetchItems(search); }
    catch (e) { alert('Gagal hapus'); }
  };

  const f = (n) => 'Rp ' + (n || 0).toLocaleString('id-ID');

  if (loading) return <div className="flex justify-center pt-12"><div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1 neumo-inset flex items-center gap-2 px-3 py-2">
          <Search size={16} style={{ color: '#a0a0b0' }} />
          <input className="bg-transparent border-none outline-none text-sm w-full placeholder:opacity-50" style={{ color: '#e0e0e0' }} placeholder="Cari nama/IMEI..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {canEdit && (
          <button onClick={openAdd} className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #4fc3f7, #29b6f6)' }}>
            <Plus size={20} style={{ color: '#1a1a2e' }} />
          </button>
        )}
      </div>

      <div className="neumo-sm p-3 flex justify-between items-center">
        <span className="text-xs" style={{ color: '#a0a0b0' }}>Total Stok</span>
        <span className="text-lg font-bold" style={{ color: '#4fc3f7' }}>{items.length} unit</span>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="neumo p-8 text-center">
            <Smartphone size={40} className="mx-auto mb-2" style={{ color: 'rgba(160,160,176,0.3)' }} />
            <p className="text-sm" style={{ color: '#a0a0b0' }}>Belum ada stok</p>
          </div>
        ) : items.map((item) => (
          <div key={item.id} className="neumo-sm p-3">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm" style={{ color: '#e0e0e0' }}>{item.nama}</h3>
                <p className="text-xs mt-0.5" style={{ color: '#a0a0b0' }}>{item.spek}</p>
                {item.imei && <p className="text-[10px] mt-0.5 font-mono" style={{ color: 'rgba(160,160,176,0.6)' }}>IMEI: {item.imei}</p>}
                <div className="flex gap-3 mt-2">
                  <span className="text-xs" style={{ color: '#f44336' }}>Modal: {f(item.harga_modal)}</span>
                  <span className="text-xs" style={{ color: '#4caf50' }}>Jual: {f(item.harga_jual)}</span>
                  <span className="text-xs" style={{ color: '#7c4dff' }}>+{f(item.harga_jual - item.harga_modal)}</span>
                </div>
              </div>
              {canEdit && (
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(item)} className="p-1.5 neumo-sm"><Edit2 size={14} style={{ color: '#4fc3f7' }} /></button>
                  <button onClick={() => handleDelete(item.id, item.nama)} className="p-1.5 neumo-sm"><Trash2 size={14} style={{ color: '#f44336' }} /></button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 modal-overlay flex items-end sm:items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 max-h-[85vh] overflow-y-auto" style={{ background: '#1e2a4a' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold" style={{ color: '#e0e0e0' }}>{editItem ? 'Edit HP' : 'Tambah HP'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1" style={{ color: '#a0a0b0' }}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input className="neumo-input" placeholder="Nama HP" value={form.nama} onChange={(e) => setForm({...form, nama: e.target.value})} />
              <input className="neumo-input" placeholder="Spesifikasi" value={form.spek} onChange={(e) => setForm({...form, spek: e.target.value})} />
              <input className="neumo-input" placeholder="IMEI" value={form.imei} onChange={(e) => setForm({...form, imei: e.target.value})} />
              <div className="grid grid-cols-2 gap-2">
                <input className="neumo-input" placeholder="Harga Modal" type="number" value={form.harga_modal} onChange={(e) => setForm({...form, harga_modal: e.target.value})} />
                <input className="neumo-input" placeholder="Harga Jual" type="number" value={form.harga_jual} onChange={(e) => setForm({...form, harga_jual: e.target.value})} />
              </div>
              <textarea className="neumo-input min-h-[60px] resize-none" placeholder="Catatan (opsional)" value={form.catatan} onChange={(e) => setForm({...form, catatan: e.target.value})} />
              <button onClick={handleSubmit} className="w-full py-3 font-semibold rounded-xl" style={{ background: 'linear-gradient(135deg, #4fc3f7, #29b6f6)', color: '#1a1a2e' }}>
                {editItem ? 'Simpan' : 'Tambah'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
