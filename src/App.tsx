import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ConfigProvider, message, theme } from 'antd';
import { useEffect, useState } from 'react';
import './index.css';
import Tray from './components/Tray/Tray';
import SplashScreen from './components/Splashscreen/Splashscreen';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeContext, darkTheme, lightTheme } from './Theme';
import { listen } from '@tauri-apps/api/event';
import { error } from 'tauri-plugin-log-api';

const App = () => {
  const [isDark, setIsDark] = useState<boolean>(true);
  const currentTheme = isDark ? darkTheme : lightTheme;

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await listen('switch_theme', _event => {
          setIsDark(!isDark)
        });
      } catch (e) {
        if (e instanceof Error) {
          error(e.message);
        }
      }
    })();
  }, [isDark]);

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
    <ThemeContext.Provider value={currentTheme}>
      <ConfigProvider
        theme={{
          algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            fontFamily: `'Rubik', sans-serif`,
            colorPrimary: '#3c81f6',
            colorBgBase: isDark
              ? darkTheme.bodyBackground
              : lightTheme.bodyBackground,
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
    </ThemeContext.Provider>
  );
};

export default App;
