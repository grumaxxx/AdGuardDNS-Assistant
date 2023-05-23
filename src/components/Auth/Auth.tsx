import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Spin, message } from 'antd';
import './Auth.css';
import logo from './../logo.svg';
import { useAuthorization } from '../../hooks/UseAuth';
import { TwoFactorForm } from './TwoFactorForm';
import { AuthForm } from './AuthForm';
import { trace, error } from 'tauri-plugin-log-api';

const Auth: React.FC<{ setToken: (token: string) => void }> = ({
  setToken,
}) => {
  const [isTwoFactorRequired, setTwoFactorRequired] = useState(false);
  const { authorize, loading } = useAuthorization();
  const [form] = Form.useForm();

  const onFinish = async (values: { username: string; password: string }) => {
    const token = await authorize(
      values.username,
      values.password,
      null,
      setTwoFactorRequired
    );
    if (token) {
      setToken(token);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    trace('Failed:', errorInfo);
  };

  const handleFormFinish = async (values: { token: string }) => {
    const { username, password } = form.getFieldsValue([
      'username',
      'password',
    ]);
    const token = await authorize(
      username,
      password,
      values.token,
      setTwoFactorRequired
    );
    if (token) {
      setToken(token);
    }
  };

  const handleFormFinishFailed = (errorInfo: any) => {
    trace('Failed:', errorInfo);
  };

  return (
    <Spin spinning={loading}>
      <Card
        className="login-card"
        bordered={false}
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{ verticalAlign: 'middle', marginBottom: '30px' }}
        />
        {isTwoFactorRequired ? (
          <TwoFactorForm
            onFinish={handleFormFinish}
            onFinishFailed={handleFormFinishFailed}
          />
        ) : (
          <AuthForm
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            form={form}
          />
        )}
      </Card>
    </Spin>
  );
};

export default Auth;
