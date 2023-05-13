import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Spin, message } from 'antd';
import './Auth.css';
import logo from './../logo.svg';
import { AxiosError } from 'axios';
import { AccessToken, TokenServerError } from '../../types';
import { Authorization } from '../Api';

const Auth: React.FC<{ setToken: (token: string) => void }> = ({
  setToken,
}) => {
  const [isTwoFactorRequired, setTwoFactorRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const result = await Authorization(values.username, values.password)
      console.log(result);
      if ('access_token' in result) {
        const data = result as AccessToken;
        localStorage.setItem('access_token', data.access_token);
        message.success('Success');
        setToken(data.access_token);
        console.log('Success:', values);
      } else {
        throw result as AxiosError;
      }
    } catch (error) {
      setLoading(false);
      if (error && (error as AxiosError).response) {
        const serverError = (error as AxiosError).response?.data as TokenServerError;
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
