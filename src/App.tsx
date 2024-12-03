import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import StoreFront from './pages/StoreFront';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { initSmoothScrolling } from './utils/lenis';
import { CartProvider } from './context/CartContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('PrivateRoute - Auth State:', { user, loading, path: location.pathname });
  }, [user, loading, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to admin page but in non-authenticated state
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function App() {
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  useEffect(() => {
    initSmoothScrolling();
  }, []);

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        {!isAdminPage && <Navbar cartCount={cartCount} onCartClick={() => {}} />}
        <div className={`flex-grow ${!isAdminPage ? "pt-16" : ""}`}>
          <Routes>
            <Route path="/" element={<StoreFront setCartCount={setCartCount} />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
        {!isAdminPage && <Footer />}
      </div>
    </CartProvider>
  );
}

export default App;