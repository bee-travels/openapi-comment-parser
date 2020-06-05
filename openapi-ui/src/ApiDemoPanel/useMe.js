import React, { useReducer } from 'react';
import produce from 'immer';
import queryString from 'query-string';

function init({
  path,
  method,
  parameters = [],
  requestBody = {},
  responses = {},
}) {
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
    acceptOptions: acceptArray,
    contentTypeOptions: contentTypeArray,
    endpoint: path,
    method: method,
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
    case actions.setResponse: {
      draft.response = action.response;
      break;
    }
    case actions.setBody: {
      draft.body = action.body;
      break;
    }
    case actions.setAccept: {
      draft.accept = action.accept;
      break;
    }
    case actions.setContentType: {
      draft.contentType = action.contentType;
      break;
    }
    default:
      break;
  }
});

const actions = {
  updateParam: 'UPDATE_PARAM',
  setResponse: 'SET_RESPONSE',
  setBody: 'SET_BODY',
  setAccept: 'SET_ACCEPT',
  setContentType: 'SET_CONTENT_TYPE',
};

export function useMe(item) {
  const [state, dispatch] = useReducer(reducer, item, init);

  function updateParam(param) {
    dispatch({ type: actions.updateParam, param });
  }

  function setResponse(response) {
    dispatch({ type: actions.setResponse, response });
  }

  function clearResponse() {
    dispatch({ type: actions.setResponse, response: undefined });
  }

  function setBody(body) {
    dispatch({ type: actions.setBody, body });
  }

  function setAccept(accept) {
    dispatch({ type: actions.setAccept, accept });
  }

  function setContentType(contentType) {
    dispatch({ type: actions.setContentType, contentType });
  }

  async function makeFetch() {
    const url = state.endpoint.replace(/{([a-z0-9-_]+)}/gi, (_, p1) => {
      return state.params.path.find((p) => p.name === p1).value || `:${p1}`;
    });

    const queryObj = {};
    state.params.query.forEach((q) => {
      if (q.value) {
        queryObj[q.name] = q.value;
      }
    });

    const fullPath = queryString.stringifyUrl({ url: url, query: queryObj });

    const response = await fetch(fullPath, {
      method: state.method.toUpperCase(),
      headers: {
        Accept: state.accept,
        'Content-Type': state.contextType,
      },
    });

    const text = await response.text();

    setResponse(text);
  }

  return {
    ...state,
    requestBodyMetadata: item.requestBody, // TODO: no...
    setAccept,
    setContentType,
    updateParam,
    setResponse,
    clearResponse,
    setBody,
    makeFetch,
  };
}

const Context = React.createContext();

export default Context;
