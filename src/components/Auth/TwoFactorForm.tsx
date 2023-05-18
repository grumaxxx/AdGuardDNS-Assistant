import { Form, Input, Button } from 'antd';

export const TwoFactorForm: React.FC<{
  onFinish: (values: { token: string }) => void;
  onFinishFailed: (errorInfo: any) => void;
}> = ({ onFinish, onFinishFailed }) => {
  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      autoComplete="off"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout="vertical"
    >
      <Form.Item
        label="Authentication code"
        name="token"
        rules={[{ required: true, message: 'Please input your code!' }]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
