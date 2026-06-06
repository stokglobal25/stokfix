import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('React Error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#1a1a2e',
          color: '#e0e0e0',
          padding: '40px 20px',
          fontFamily: 'monospace',
          fontSize: '13px'
        }}>
          <h2 style={{ color: '#f44336', marginBottom: 16 }}>⚠️ Error</h2>
          <pre style={{
            background: 'rgba(244,67,54,0.1)',
            padding: 16,
            borderRadius: 8,
            overflow: 'auto',
            color: '#ff8a80',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
          }}>
            {this.state.error.toString()}
            {'\n\n'}
            {this.state.error.stack?.split('\n').slice(0, 8).join('\n')}
          </pre>
          <button
            onClick={() => window.location.hash = '#/'}
            style={{
              marginTop: 20,
              padding: '12px 24px',
              background: '#4fc3f7',
              color: '#1a1a2e',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14
            }}
          >
            Kembali ke Login
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
