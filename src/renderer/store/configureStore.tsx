import { configureStore } from '@reduxjs/toolkit';
import type { Reducer } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducers, { RootState } from './reducer';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(
  persistConfig,
  rootReducers as Reducer<RootState>
);

export default () => {
  const reduxStore = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV === 'development',
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),
  });

  const persistor = persistStore(reduxStore);

  return { reduxStore, persistor };
};
