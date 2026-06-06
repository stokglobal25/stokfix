import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Smartphone, Mail, Lock, LogIn, UserPlus } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // login | register
  const [name, setName] = useState('');
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (mode === 'login') {
      result = await login(email, password);
    } else {
      if (!name.trim()) { setError('Nama harus diisi'); setLoading(false); return; }
      result = await register(email, password, name);
    }

    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#1a1a2e' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="neumo w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Smartphone size={40} style={{ color: '#4fc3f7' }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: '#e0e0e0' }}>StokFix</h1>
          <p className="text-sm mt-1" style={{ color: '#a0a0b0' }}>
            {mode === 'login' ? 'Masuk ke akun Anda' : 'Buat akun baru'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#a0a0b0' }}>Nama</label>
              <div className="neumo-inset flex items-center gap-2 px-3 py-2.5">
                <UserPlus size={16} style={{ color: '#a0a0b0' }} />
                <input
                  className="bg-transparent border-none outline-none text-sm w-full"
                  style={{ color: '#e0e0e0' }}
                  placeholder="Nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#a0a0b0' }}>Email</label>
            <div className="neumo-inset flex items-center gap-2 px-3 py-2.5">
              <Mail size={16} style={{ color: '#a0a0b0' }} />
              <input
                className="bg-transparent border-none outline-none text-sm w-full"
                style={{ color: '#e0e0e0' }}
                type="email"
                placeholder="admin@stokfix.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus={mode === 'login'}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#a0a0b0' }}>Password</label>
            <div className="neumo-inset flex items-center gap-2 px-3 py-2.5">
              <Lock size={16} style={{ color: '#a0a0b0' }} />
              <input
                className="bg-transparent border-none outline-none text-sm w-full"
                style={{ color: '#e0e0e0' }}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-center" style={{ color: '#f44336' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #4fc3f7, #29b6f6)', color: '#1a1a2e' }}
          >
            {loading ? (
              <div className="animate-spin w-5 h-5 border-2 border-bg-primary border-t-transparent rounded-full" />
            ) : (
              <>{mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
              {mode === 'login' ? 'Masuk' : 'Daftar'}</>
            )}
          </button>
        </form>

        {/* Toggle mode */}
        <div className="text-center mt-6">
          <button onClick={toggleMode} className="text-xs font-medium" style={{ color: '#4fc3f7' }}>
            {mode === 'login' ? 'Belum punya akun? Daftar di sini' : 'Sudah punya akun? Masuk'}
          </button>
        </div>

        {/* Hint */}
        {mode === 'login' && (
          <div className="neumo-sm p-3 mt-6">
            <p className="text-xs font-medium mb-1" style={{ color: '#a0a0b0' }}>Akun Demo:</p>
            <p className="text-[10px]" style={{ color: 'rgba(160,160,176,0.6)' }}>
              admin@stokfix.com / admin123
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
