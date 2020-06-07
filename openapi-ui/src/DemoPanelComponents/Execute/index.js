import React from 'react';
import { useSelector } from 'react-redux';
import queryString from 'query-string';

import styles from './styles.module.css';
import { useActions } from 'redux/actions';

async function buildAndMakeFetch(state) {
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

  return await response.text();
}

function isRequestComplete(params) {
  for (let paramList of Object.values(params)) {
    for (let param of paramList) {
      if (param.required && !param.value) {
        return false;
      }
    }
  }
  return true;
}

function Execute() {
  const state = useSelector((state) => state);
  const { setResponse } = useActions();

  const finishedRequest = isRequestComplete(state.params);

  return (
    <button
      className={styles.executeButton}
      disabled={!finishedRequest}
      onClick={async () => {
        const res = await buildAndMakeFetch(state);
        setResponse(res);
      }}
    >
      Execute
    </button>
  );
}

export default Execute;
