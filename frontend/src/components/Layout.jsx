import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Wallet, ShoppingCart, CreditCard, Users, ClipboardList, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'kasir', 'stok', 'keuangan'] },
  { to: '/inventory', icon: Package, label: 'Stok', roles: ['admin', 'kasir', 'stok'] },
  { to: '/cash-flow', icon: Wallet, label: 'Kas', roles: ['admin', 'keuangan'] },
  { to: '/sales', icon: ShoppingCart, label: 'Jual', roles: ['admin', 'kasir'] },
  { to: '/credits', icon: CreditCard, label: 'Kredit', roles: ['admin', 'keuangan'] },
  { to: '/users', icon: Users, label: 'Pengguna', roles: ['admin'] },
  { to: '/activity', icon: ClipboardList, label: 'Log', roles: ['admin'] },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const allowedItems = NAV_ITEMS.filter((item) => item.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen relative" style={{ background: '#1a1a2e' }}>
      <div className="pb-20">
        {/* Header */}
        <div className="sticky top-0 z-30" style={{ background: 'rgba(22,33,62,0.95)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <h1 className="text-lg font-bold" style={{ color: '#e0e0e0' }}>StokFix</h1>
              <p className="text-xs" style={{ color: '#a0a0b0' }}>
                {user?.name} • <span className="capitalize">{user?.role}</span> • {user?.email}
              </p>
            </div>
            <button onClick={handleLogout} className="p-2 neumo-sm" style={{ color: '#a0a0b0' }}>
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-30 flex justify-around items-center py-2 px-1 overflow-x-auto">
        {allowedItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all shrink-0 ${
                isActive ? '' : ''
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? '#4fc3f7' : '#a0a0b0',
            })}
          >
            <item.icon size={20} />
            <span className="text-[9px] font-medium whitespace-nowrap">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
