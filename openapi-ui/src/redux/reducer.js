import produce from 'immer';
import { types } from './actions';

const reducer = produce((draft, action) => {
  switch (action.type) {
    case types.updateParam: {
      draft.params[action.param.type][
        draft.params[action.param.type].findIndex(
          (param) => param.name === action.param.name
        )
      ] = action.param;
      break;
    }
    case types.setResponse: {
      draft.response = action.response;
      break;
    }
    case types.setBody: {
      draft.body = action.body;
      break;
    }
    case types.setAccept: {
      draft.accept = action.accept;
      break;
    }
    case types.setContentType: {
      draft.contentType = action.contentType;
      break;
    }
    default:
      break;
  }
});

export default reducer;
