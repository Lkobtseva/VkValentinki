import React from "react";
import AppRouter from "../routes/router";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      // Перенаправляем на страницу с сообщением об ошибке
      return <AppRouter />;
    }

    return children;
  }
}

export default ErrorBoundary;
