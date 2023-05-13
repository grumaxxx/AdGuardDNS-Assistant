import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import './index.css';
import Tray from './components/Tray/Tray';
import QueryLog from './components/QueryLog/QueryLog';

const App = () => {
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
      </Routes>
    </ConfigProvider>
  );
};

export default App;
