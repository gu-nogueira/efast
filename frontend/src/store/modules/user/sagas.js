import { takeLatest, call, put, all } from '@redux-saga/core/effects';
import history from '../../../services/history';
import api from '../../../services/api';
import {
  updateProfileSuccess,
  updateProfileFailure,
  verifyUserSuccess,
  verifyUserFailure,
} from './actions';

import { toast } from 'react-toastify';

export function* updateProfile({ payload }) {
  try {
    const { name, email, avatar_id, ...rest } = payload.data;

    /*
     *  Check if has oldPassword to send request
     */

    const profile = Object.assign(
      { name, email, avatar_id },
      rest.oldPassword ? rest : {}
    );

    const response = yield call(api.put, 'user', profile);
    toast.success('Perfil atualizado com sucesso');
    yield put(updateProfileSuccess(response.data));
  } catch (err) {
    toast.error('Erro ao atualizar perfil, confira seus dados');
    yield put(updateProfileFailure());
  }
}

export function* verifyUser({ payload }) {
  try {
    const { hash } = payload;

    const response = yield call(api.post, `verify/${hash}`);
    if (response.data.message === 'User has already been verified') {
      toast.info('E-mail já verificado');
    } else {
      toast.success('E-mail verificado com sucesso');
    }
    yield put(verifyUserSuccess(0));
  } catch (err) {
    toast.error('Link inválido!');
    yield put(verifyUserFailure());
  }
  history.push('/login');
}

export default all([
  takeLatest('@user/UPDATE_PROFILE_REQUEST', updateProfile),
  takeLatest('@user/VERIFY_USER_REQUEST', verifyUser),
]);
