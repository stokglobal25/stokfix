import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import CashFlowPage from './pages/CashFlowPage';
import SalesPage from './pages/SalesPage';
import CreditsPage from './pages/CreditsPage';
import UsersPage from './pages/UsersPage';
import ActivityPage from './pages/ActivityPage';

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/cash-flow" element={<CashFlowPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/credits" element={<CreditsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/activity" element={<ActivityPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}
