import { Form, Input, Button, FormInstance } from 'antd';

export const AuthForm: React.FC<{
  onFinish: (values: { username: string; password: string }) => void;
  onFinishFailed: (errorInfo: any) => void;
  form: FormInstance;
}> = ({ onFinish, onFinishFailed, form }) => {
  return (
    <Form
      form={form}
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
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password autoComplete="off" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
