import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Spin, message } from 'antd';
import axios from 'axios';
import './Auth.css';
import logo from './../logo.svg';
import { AxiosError } from 'axios';

interface LoginForm {
  username: string;
  password: string;
}

interface AccessToken {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

interface ServerError {
  error: string;
  error_code: string;
  error_description: string;
}

const Auth: React.FC<{ setToken: (token: string) => void }> = ({
  setToken,
}) => {
  const [isTwoFactorRequired, setTwoFactorRequired] = useState(false);
  const [loading, setLoading] = useState(false); // новое состояние

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const result = await axios.post(
        'https://api.adguard-dns.io/oapi/v1/oauth_token',
        {
          username: values.username,
          password: values.password,
        },
        {
          headers: {
            'Content-Type': `application/x-www-form-urlencoded`,
          },
        }
      );

      if ('access_token' in result.data) {
        const data = result.data as AccessToken;
        localStorage.setItem('access_token', data.access_token);
        setToken(data.access_token); // Устанавливаем токен
        console.log('Success:', values);
      } else {
        const errorData = result.data as ServerError;
        throw errorData;
      }
    } catch (error) {
      setLoading(false);
      if (error && (error as AxiosError).response) {
        const serverError = (error as AxiosError).response?.data as ServerError;
        message.error(serverError.error_description);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      console.log(token);
      setToken(token);
    }
  }, [setToken]);

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
