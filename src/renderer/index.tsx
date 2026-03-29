import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import App from "./App";
import AppErrorBoundary from './components/appErrorBoundary';
import { PersistGate } from 'redux-persist/integration/react'
import returnVar from './store/configureStore'
import './styles/design-tokens.css';
import './styles/tailwind.css';

const myVar = returnVar()


declare global {
  interface Window {
    electron: {
      store: {
        get: (key: string) => any;
        set: (key: string, val: any) => void;
        // any other methods you've defined...
      },
      ipcRenderer: any
    }
    
  }
}

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);

root.render(
  <Provider store={myVar.reduxStore}>
    <PersistGate loading={null} persistor={myVar.persistor}>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </PersistGate>
  </Provider>
);
