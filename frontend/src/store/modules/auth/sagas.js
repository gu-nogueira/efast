import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import history from '../../../services/history';
import api from '../../../services/api';

import { signInSuccess, signUpSuccess, signFailure } from './actions';

/*
 *  Login saga
 */

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;

    /*
     *  Call promise
     */

    const response = yield call(api.post, 'sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    /*
     *  Token insertion on Axios
     */

    api.defaults.headers['Authorization'] = `Bearer ${token}`;

    yield put(signInSuccess(token, user));

    history.push('/');
  } catch (err) {
    const { data } = err.response;
    switch (data.error) {
      case 'User not verified': {
        toast.error('E-mail não verificado');
        break;
      }
      default:
        toast.error('Falha na autenticação, verifique seus dados');
    }
    yield put(signFailure());
  }
}

/*
 *  Register saga
 */

export function* signUp({ payload }) {
  try {
    const { name, email, password } = payload;

    const response = yield call(api.post, 'user', {
      name,
      email,
      password,
    });

    const { role } = response.data;
    yield put(signUpSuccess(name, email, role));
  } catch (err) {
    toast.error('Falha no cadastro, verifique seus dados');
    yield put(signFailure());
  }
}

/*
 *  Token keep alive
 */

export function setToken({ payload }) {
  if (!payload) return;

  const { token } = payload.auth;

  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  }
}

/*
 *  Logout saga
 */

export function signOut() {
  history.push('/');
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
  takeLatest('@auth/SIGN_OUT', signOut),
]);
