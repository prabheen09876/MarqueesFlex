import { Routes, Route, useLocation } from 'react-router-dom';
import StoreFront from './pages/StoreFront';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';
import Loading from './components/Loading';
import { useState, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      lenis.destroy();
      clearTimeout(timer);
    };
  }, []);

  if (isLoading && !isAdminPage) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen">
      {!isAdminPage && <Navbar cartCount={cartCount} onCartClick={() => {}} />}
      <div className={!isAdminPage ? "pt-16" : ""}>
        <Routes>
          <Route path="/" element={<StoreFront />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;