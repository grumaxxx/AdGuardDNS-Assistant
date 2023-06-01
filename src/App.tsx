import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ConfigProvider, message } from 'antd';
import { useEffect } from 'react';
import './index.css';
import Tray from './components/Tray/Tray';
import SplashScreen from './components/Splashscreen/Splashscreen';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  message.config({
    maxCount: 3,
  });

  useEffect(() => {
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener('contextmenu', preventContextMenu);

    return () => {
      window.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);

  useEffect(() => {
    if (location.search === '?type=tray') {
      navigate('/tray');
    } else if (location.search === '?type=splash_screen') {
      navigate('/splash_screen');
    }
  }, [location.search, navigate]);

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: `'Rubik', sans-serif`,
          colorPrimary: '#3c81f6',
        },
      }}
    >
      <ErrorBoundary>
        <Routes>
          <Route path="/tray" element={<Tray />} />
          <Route path="/splash_screen" element={<SplashScreen />} />
        </Routes>
      </ErrorBoundary>
    </ConfigProvider>
  );
};

export default App;
