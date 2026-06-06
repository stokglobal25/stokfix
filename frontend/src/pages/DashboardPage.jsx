import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Package, TrendingUp, DollarSign, CreditCard, Target, ShoppingCart, Plus, Wallet } from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const [dashRes, cashRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/cash-flow'),
        ]);
        setData(dashRes.data);
        setRecent((cashRes.data || []).slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const f = (n) => 'Rp ' + (n || 0).toLocaleString('id-ID');

  if (loading) {
    return <div className="flex justify-center pt-12"><div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {user?.role !== 'keuangan' && (
          <button onClick={() => navigate('/inventory')} className="neumo-sm flex items-center gap-2 px-4 py-3 text-sm shrink-0" style={{ color: '#e0e0e0' }}>
            <Plus size={16} style={{ color: '#4fc3f7' }} /> Tambah Stok
          </button>
        )}
        {(user?.role === 'admin' || user?.role === 'kasir') && (
          <button onClick={() => navigate('/sales')} className="neumo-sm flex items-center gap-2 px-4 py-3 text-sm shrink-0" style={{ color: '#e0e0e0' }}>
            <ShoppingCart size={16} style={{ color: '#4caf50' }} /> Catat Jual
          </button>
        )}
        {(user?.role === 'admin' || user?.role === 'keuangan') && (
          <button onClick={() => navigate('/credits')} className="neumo-sm flex items-center gap-2 px-4 py-3 text-sm shrink-0" style={{ color: '#e0e0e0' }}>
            <CreditCard size={16} style={{ color: '#ff9800' }} /> Tagihan
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Package size={16} style={{ color: '#4fc3f7' }} />
            <span className="text-xs" style={{ color: '#a0a0b0' }}>Total Stok</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#e0e0e0' }}>{data?.total_inventory || 0}</p>
          <p className="text-[10px] mt-1" style={{ color: '#a0a0b0' }}>Unit HP</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} style={{ color: '#4caf50' }} />
            <span className="text-xs" style={{ color: '#a0a0b0' }}>Total Modal</span>
          </div>
          <p className="text-lg font-bold" style={{ color: '#e0e0e0' }}>{f(data?.total_modal)}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} style={{ color: '#7c4dff' }} />
            <span className="text-xs" style={{ color: '#a0a0b0' }}>Total Jual</span>
          </div>
          <p className="text-lg font-bold" style={{ color: '#e0e0e0' }}>{f(data?.total_jual)}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} style={{ color: '#ff9800' }} />
            <span className="text-xs" style={{ color: '#a0a0b0' }}>Potensi Margin</span>
          </div>
          <p className="text-lg font-bold" style={{ color: '#4caf50' }}>{f(data?.total_margin)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="neumo-sm p-3 flex items-center gap-3">
          <div className="neumo-sm p-2">
            <Wallet size={18} style={{ color: '#4fc3f7' }} />
          </div>
          <div>
            <p className="text-xs" style={{ color: '#a0a0b0' }}>Saldo Kas</p>
            <p className="font-bold text-sm" style={{ color: (data?.cash_balance || 0) >= 0 ? '#4caf50' : '#f44336' }}>
              {f(data?.cash_balance)}
            </p>
          </div>
        </div>
        <div className="neumo-sm p-3 flex items-center gap-3">
          <div className="neumo-sm p-2">
            <CreditCard size={18} style={{ color: '#ff9800' }} />
          </div>
          <div>
            <p className="text-xs" style={{ color: '#a0a0b0' }}>Total Piutang</p>
            <p className="font-bold text-sm" style={{ color: '#ff9800' }}>{f(data?.total_kredit)}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-2" style={{ color: '#e0e0e0' }}>Aktivitas Terbaru</h2>
        <div className="neumo p-3">
          {recent.length === 0 ? (
            <p className="text-xs text-center py-4" style={{ color: '#a0a0b0' }}>Belum ada transaksi</p>
          ) : (
            recent.map((item, i) => (
              <div key={item.id || i} className="table-row flex items-center justify-between py-2">
                <div>
                  <p className="text-sm" style={{ color: '#e0e0e0' }}>{item.deskripsi}</p>
                  <p className="text-[10px]" style={{ color: '#a0a0b0' }}>{item.kategori} • {item.tanggal?.split('T')[0]}</p>
                </div>
                <p className="font-semibold text-sm" style={{ color: item.tipe === 'pemasukan' ? '#4caf50' : '#f44336' }}>
                  {item.tipe === 'pemasukan' ? '+' : '-'}{f(item.jumlah)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
