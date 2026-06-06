import { useState, useEffect } from 'react';
import api from '../api';
import { ClipboardList, Activity } from 'lucide-react';

export default function ActivityPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try { const r = await api.get('/activity-log'); setLogs(r.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchLogs(); }, []);

  const fd = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

  const getActionStyle = (action) => {
    const s = {
      'create': { color: '#4caf50', label: 'Buat' },
      'update': { color: '#4fc3f7', label: 'Edit' },
      'delete': { color: '#f44336', label: 'Hapus' },
      'login': { color: '#ff9800', label: 'Login' },
    };
    return s[action] || { color: '#a0a0b0', label: action };
  };

  if (loading) return <div className="flex justify-center pt-12"><div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: '#e0e0e0' }}>
        <ClipboardList size={16} style={{ color: '#4fc3f7' }} />
        Log Aktivitas
      </h2>

      {logs.length === 0 ? (
        <div className="neumo p-6 text-center">
          <Activity size={32} className="mx-auto mb-2" style={{ color: 'rgba(160,160,176,0.3)' }} />
          <p className="text-sm" style={{ color: '#a0a0b0' }}>Belum ada aktivitas</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {logs.map((log) => {
            const as = getActionStyle(log.action);
            return (
              <div key={log.id} className="neumo-sm p-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: as.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium" style={{ color: '#e0e0e0' }}>{log.user_name}</span>
                      <span className="badge text-[9px]" style={{ background: `${as.color}20`, color: as.color }}>{as.label}</span>
                      <span className="badge text-[9px]" style={{ background: 'rgba(160,160,176,0.15)', color: '#a0a0b0' }}>{log.resource}</span>
                    </div>
                    {log.detail && <p className="text-[10px] mt-0.5" style={{ color: 'rgba(160,160,176,0.7)' }}>{log.detail}</p>}
                    <p className="text-[9px] mt-0.5" style={{ color: 'rgba(160,160,176,0.4)' }}>{fd(log.created_at)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
