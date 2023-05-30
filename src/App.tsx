import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ConfigProvider, message, theme } from 'antd';
import { useEffect, useState } from 'react';
import './index.css';
import Tray from './components/Tray/Tray';
import SplashScreen from './components/Splashscreen/Splashscreen';
import ErrorBoundary from './components/ErrorBoundary';

interface ThemeInterface {
  bodyBackground: string;
}

const lightTheme: ThemeInterface = { bodyBackground: '#ffffff' };
const darkTheme: ThemeInterface = { bodyBackground: '#121212' };

const App = () => {
  const [isDark, setIsDark] = useState<boolean>(true);

  const location = useLocation();
  const navigate = useNavigate();

  message.config({
    maxCount: 3,
  });

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
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          fontFamily: `'Rubik', sans-serif`,
          colorPrimary: '#3c81f6',
          colorBgBase: isDark ? darkTheme.bodyBackground : darkTheme.bodyBackground,
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
