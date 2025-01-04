import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import StoreFront from './pages/StoreFront';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { initSmoothScrolling } from './utils/lenis';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import { auth } from './firebase/config';
import { useNavigate } from 'react-router-dom';
import Login from './components/Login';

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
  const navigate = useNavigate();

  useEffect(() => {
    initSmoothScrolling();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user && window.location.pathname.includes('/admin')) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <CartProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#659287',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="min-h-screen flex flex-col">
        {!isAdminPage && <Navbar cartCount={cartCount} onCartClick={() => { }} />}
        <div className={`flex-grow ${!isAdminPage ? "pt-16" : ""}`}>
          <Routes>
            <Route path="/" element={<StoreFront setCartCount={setCartCount} />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminPanel />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
        {!isAdminPage && <Footer />}
      </div>
    </CartProvider>
  );
}

export default App;