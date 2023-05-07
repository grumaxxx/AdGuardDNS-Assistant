import { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';
import Title from 'antd/es/skeleton/Title';
import axios from 'axios';
import './Auth.css';
import logo from './../logo.svg';

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

const Auth: React.FC<{ setToken: (token: string) => void }> = ({
  setToken,
}) => {
  const [loginForm, setLoginForm] = useState<LoginForm>({
    username: '',
    password: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const onFinish = (values: { username: string; password: string }) => {
    setToken("asd");
    // axios
    //   .post(
    //     'https://api.adguard-dns.io/oapi/v1/oauth_token',
    //     {
    //       username: loginForm.username,
    //       password: loginForm.password,
    //     },
    //     {
    //       headers: {
    //         'Content-Type': `application/x-www-form-urlencoded`,
    //       },
    //     }
    //   )
    //   .then(result => {
    //     console.log('Success:', values);
    //   })
    //   .catch(error => {
    //     setLoginForm({ username: loginForm.username, password: '' });
    //   });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Card
      className="login-card"
      bordered={false}
      style={{
        width: '100vw', // 100% ширины экрана
        height: '100vh', // 100% высоты экрана
        display: 'flex', // включение Flexbox
        justifyContent: 'center', // центрирование по горизонтали
        alignItems: 'center', // центрирование по вертикали
        flexDirection: 'column', // элементы по вертикали
      }}
    >
      <img
        src={logo}
        alt="Logo"
        style={{ verticalAlign: 'middle', marginBottom: '30px' }}
      />

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
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Auth;
