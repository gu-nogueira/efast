import produce from 'immer';

const INITIAL_STATE = {
  profile: null,
};

export default function user(state = INITIAL_STATE, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case '@auth/SIGN_IN_SUCCESS': {
        draft.profile = action.payload.user;
        break;
      }

      case '@auth/SIGN_UP_SUCCESS': {
        draft.profile = {
          name: action.payload.name,
          email: action.payload.email,
        };
        draft.verification = action.payload.role;
        break;
      }

      case '@user/VERIFY_USER_SUCCESS': {
        draft.verification = action.payload.role;
        break;
      }

      case '@user/UPDATE_PROFILE_SUCCESS': {
        draft.profile = action.payload.profile;
        break;
      }

      case '@auth/SIGN_OUT': {
        draft.profile = null;
        break;
      }

      default:
    }
  });
}
