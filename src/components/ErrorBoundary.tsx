import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Result, Button } from 'antd';
import { error } from "tauri-plugin-log-api";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(err: Error, errorInfo: ErrorInfo) {
    error(`Uncaught error: ${err}, ${errorInfo}`);
    this.setState({ error: err, errorInfo: errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Sorry.. there was an error"
          // extra={<Button type="primary">Reload</Button>}
        />
      );
    }
  
    return this.props.children;
  }  
}

export default ErrorBoundary;
