import { Routes, Route } from 'react-router-dom';
import StoreFront from './pages/StoreFront';
import Navbar from './components/Navbar';
import { useState, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

function App() {
  const [cartCount, setCartCount] = useState(0);

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

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar cartCount={cartCount} onCartClick={() => {}} />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<StoreFront />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;