import React from 'react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';

import './config/ReactotronConfig';

import history from './services/history';
import Routes from './routes';

import Modal from './components/Modal';

// Redux store always cames after ReactotronConfig
import { store, persistor } from './store';

import GlobalStyle from './styles/global';

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router history={history}>
          <Routes />
          <GlobalStyle />
          <Modal />
          <ToastContainer
            position="top-center"
            autoClose={3000}
            theme={'colored'}
          />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
