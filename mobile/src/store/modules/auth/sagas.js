import { Alert } from 'react-native';
import { takeLatest, call, put, all } from 'redux-saga/effects';

import api from '~/services/api';
import { navigate } from '~/services/navigation';

import errorParser from '~/utils/errorParser';

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

    api.defaults.headers.Authorization = `Bearer ${token}`;

    yield put(signInSuccess(token, user));
  } catch (err) {
    Alert.alert(
      'Falha na autenticação',
      err.response?.data?.error
        ? errorParser(err.response.data.error)
        : 'Houve um erro no login, verifique seus dados',
    );
    yield put(signFailure());
  }
}

export function* signUp({ payload }) {
  try {
    const { name, email, password } = payload;

    yield call(api.post, 'register', {
      name,
      email,
      password,
    });
    yield put(signUpSuccess(name, email, password));
    Alert.alert(
      'Solicitação enviada',
      'Obrigado! Entraremos em contato via e-mail para liberação do seu acesso! :)',
    );
    navigate('SignIn');
  } catch (err) {
    Alert.alert(
      'Falha no cadastro',
      'Houve um erro no cadastro, verifique seus dados',
    );
    console.tron.log(err);
    yield put(signFailure());
  }
}

// Token keep alive
export function setToken({ payload }) {
  if (!payload) {
    return;
  }

  const { token } = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
]);
