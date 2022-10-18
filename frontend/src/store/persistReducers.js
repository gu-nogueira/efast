import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const persist = (reducers) => {
  const persistedReducer = persistReducer(
    {
      key: 'efast',
      storage,
      // Persisted data
      whitelist: ['auth', 'user'],
    },
    reducers
  );

  return persistedReducer;
};

export default persist;
