import React from 'react';

type AppErrorBoundaryProps = {
  children: React.ReactNode;
};

type AppErrorBoundaryState = {
  error: Error | null;
};

export default class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = {
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Renderer crashed', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="min-h-screen bg-[var(--bg-level-one)] px-6 py-10 text-[var(--text-primary)]">
          <div className="mx-auto max-w-3xl rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-200">
              渲染错误
            </p>
            <h1 className="mt-4 text-2xl font-semibold text-[var(--text-primary)]">
              应用在渲染过程中遇到运行时错误。
            </h1>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              此页面用于防止出现空白窗口。错误详情如下，同时已记录到开发者控制台。
            </p>
            <pre className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-[var(--bg-level-one)] p-4 text-xs leading-6 text-rose-100">
              {this.state.error.stack || this.state.error.message}
            </pre>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
