import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { useEffect } from 'react';
import './index.css';
import Tray from './components/Tray/Tray';
import QueryLog from './components/QueryLog/QueryLog';
import SplashScreen from './components/Splashscreen/Splashscreen';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.search === '?type=tray') {
      navigate('/tray');
    } else if (location.search === '?type=query_log') {
      navigate('/query_log');
    } else if (location.search === '?type=splash_screen') {
      navigate('/splash_screen');
    }
  }, [location.search, navigate]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: '#ffffff',
          colorPrimary: '#3c81f6',
        },
      }}
    >
      <Routes>
        <Route path="/tray" element={<Tray />} />
        <Route path="/query_log" element={<QueryLog />} />
        <Route path="/splash_screen" element={<SplashScreen />} />
      </Routes>
    </ConfigProvider>
  );
};

export default App;
