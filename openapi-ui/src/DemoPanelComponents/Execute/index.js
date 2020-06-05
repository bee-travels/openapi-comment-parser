import React, { useContext } from 'react';
import Context from 'ApiDemoPanel/useMe';

import styles from './styles.module.css';

function Execute() {
  const { params, makeFetch } = useContext(Context);

  let finishedRequest = true;
  Object.values(params).forEach((paramList) => {
    paramList.forEach((param) => {
      if (param.required && !param.value) {
        finishedRequest = false;
      }
    });
  });

  return (
    <button
      className={styles.executeButton}
      disabled={!finishedRequest}
      onClick={() => makeFetch()}
    >
      Execute
    </button>
  );
}

export default Execute;
