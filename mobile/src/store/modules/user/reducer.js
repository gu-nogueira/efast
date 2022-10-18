import produce from 'immer';

const INITIAL_STATE = {
  profile: null,
};

// Um reducer pode ouvir actions de outros módulos (interessante)

export default function user(state = INITIAL_STATE, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case '@auth/SIGN_IN_SUCCESS': {
        draft.profile = action.payload.deliveryman;
        break;
      }

      case '@user/UPDATE_PROFILE_SUCCESS': {
        draft.profile = action.payload.profile;
        break;
      }

      // Vamos ouvir a action sign out nos dois reducers, para zerar totalmente o storage
      case '@auth/SIGN_OUT': {
        draft.profile = null;
        break;
      }

      default:
    }
  });
}
