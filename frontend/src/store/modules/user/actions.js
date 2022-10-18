/*
 *  Profile actions
 */

export function updateProfileRequest(data) {
  return {
    type: '@user/UPDATE_PROFILE_REQUEST',
    payload: { data },
  };
}

export function updateProfileSuccess(profile) {
  return {
    type: '@user/UPDATE_PROFILE_SUCCESS',
    payload: { profile },
  };
}

export function updateProfileFailure() {
  return {
    type: '@user/UPDATE_PROFILE_FAILURE',
  };
}

/*
 *  User verification actions
 */

export function verifyUserRequest(hash) {
  return {
    type: '@user/VERIFY_USER_REQUEST',
    payload: { hash },
  };
}

export function verifyUserSuccess(role) {
  return {
    type: '@user/VERIFY_USER_SUCCESS',
    payload: { role },
  };
}

export function verifyUserFailure() {
  return {
    type: '@user/VERIFY_USER_FAILURE',
  };
}
