import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Spin, message } from 'antd';
import './Auth.css';
import logo from './../logo.svg';
import { useAuthorization } from '../../hooks/UseAuth';
import { useStoredToken } from '../../hooks/useStoredToken';

const Auth: React.FC<{ setToken: (token: string) => void }> = ({
  setToken,
}) => {
  const [isTwoFactorRequired, setTwoFactorRequired] = useState(false);
  const { authorize, loading } = useAuthorization();
  useStoredToken(setToken);

  const onFinish = async (values: { username: string; password: string }) => {
    const token = await authorize(values.username, values.password);
    if (token) {
      setToken(token);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
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
          <></>
        ) : (
          <Form
            name="basic"
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Submit
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </Spin>
  );
};

export default Auth;
