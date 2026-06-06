import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Users, Shield, UserPlus, X, ToggleLeft, ToggleRight } from 'lucide-react';

const ROLES = ['admin', 'kasir', 'stok', 'keuangan'];

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'kasir' });
  const { user: me } = useAuth();

  const fetchUsers = async () => {
    try { const r = await api.get('/users'); setUsers(r.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async () => {
    try {
      const res = await api.post('/auth/register', form);
      setShowModal(false);
      setForm({ email: '', password: '', name: '', role: 'kasir' });
      fetchUsers();
    } catch (e) { alert(e.response?.data?.detail || 'Gagal'); }
  };

  const handleToggleActive = async (user) => {
    try {
      await api.put(`/users/${user.id}`, { is_active: !user.is_active });
      fetchUsers();
    } catch (e) { alert('Gagal update'); }
  };

  const fd = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-';

  if (loading) return <div className="flex justify-center pt-12"><div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold" style={{ color: '#e0e0e0' }}>
          <Shield size={16} className="inline mr-1" style={{ color: '#4fc3f7' }} />
          Kelola Pengguna
        </h2>
        <button onClick={() => setShowModal(true)} className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #4fc3f7, #29b6f6)' }}>
          <UserPlus size={18} style={{ color: '#1a1a2e' }} />
        </button>
      </div>

      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="neumo-sm p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(79,195,247,0.2)', color: '#4fc3f7' }}>
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: '#e0e0e0' }}>{u.name}</h3>
                    <p className="text-[10px]" style={{ color: '#a0a0b0' }}>{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="badge" style={{
                    background: u.role === 'admin' ? 'rgba(79,195,247,0.2)' : 'rgba(124,77,255,0.2)',
                    color: u.role === 'admin' ? '#4fc3f7' : '#7c4dff'
                  }}>
                    {u.role}
                  </span>
                  <span className="text-[10px]" style={{ color: 'rgba(160,160,176,0.6)' }}>
                    Terakhir: {fd(u.last_login)}
                  </span>
                </div>
              </div>
              {me?.id !== u.id && (
                <button onClick={() => handleToggleActive(u)} className="p-2 neumo-sm" title={u.is_active ? 'Nonaktifkan' : 'Aktifkan'}>
                  {u.is_active ? <ToggleRight size={20} style={{ color: '#4caf50' }} /> : <ToggleLeft size={20} style={{ color: '#f44336' }} />}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 modal-overlay flex items-end sm:items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5" style={{ background: '#1e2a4a' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold" style={{ color: '#e0e0e0' }}>Tambah Pengguna</h2>
              <button onClick={() => setShowModal(false)} className="p-1" style={{ color: '#a0a0b0' }}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input className="neumo-input" placeholder="Nama" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
              <input className="neumo-input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
              <input className="neumo-input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
              <select className="neumo-input" value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}>
                {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
              <button onClick={handleCreate} className="w-full py-3 font-semibold rounded-xl" style={{ background: 'linear-gradient(135deg, #4fc3f7, #29b6f6)', color: '#1a1a2e' }}>Tambah</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
