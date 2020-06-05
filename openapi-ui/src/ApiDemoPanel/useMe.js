import React, { useReducer } from 'react';
import produce from 'immer';

function init({ parameters = [], requestBody = {}, responses = {} }) {
  const { content = {} } = requestBody;

  const contentTypeArray = Object.keys(content);

  const acceptArray = [
    ...new Set(
      Object.values(responses)
        .map((response) => Object.keys(response.content || {}))
        .flat()
    ),
  ];

  let params = {
    path: [],
    query: [],
    header: [],
    cookie: [],
  };

  parameters.forEach((param) => {
    params[param.in].push({
      name: param.name,
      value: undefined,
      description: param.description,
      type: param.in,
      required: param.required,
    });
  });

  return {
    params: params,
    contentType: contentTypeArray[0],
    accept: acceptArray[0],
    body: undefined,
    response: undefined,
  };
}

const reducer = produce((draft, action) => {
  switch (action.type) {
    case actions.updateParam: {
      draft.params[action.param.type][
        draft.params[action.param.type].findIndex(
          (param) => param.name === action.param.name
        )
      ] = action.param;
      break;
    }
    default:
      break;
  }
});

// function reducer(state, action) {
//   switch (action.type) {
//     case actions.updateParam: {
//       return produce(state, (draftState) => {
//         draftState.params[action.param.type] = action.param;
//       });
//     }
//     default:
//       throw new Error();
//   }
// }

const actions = {
  updateParam: 'UPDATE_PARAM',
};

export function useMe(item) {
  const [state, dispatch] = useReducer(reducer, item, init);

  function updateParam(param) {
    dispatch({ type: actions.updateParam, param });
  }

  return { ...state, updateParam };
}

const Context = React.createContext();

export default Context;
