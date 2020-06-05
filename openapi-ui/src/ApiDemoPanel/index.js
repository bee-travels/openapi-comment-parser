import React from 'react';

// import MagicDropzone from 'react-magic-dropzone';

import MethodEndpoint from 'DemoPanelComponents/MethodEndpoint';
import ParamOptions from 'DemoPanelComponents/ParamOptions';
import VSCode from 'DemoPanelComponents/VSCode';
import Curl from 'DemoPanelComponents/Curl';
import { sampleFromSchema } from 'x-utils';
import Context, { useMe } from './useMe';

import styles from './styles.module.css';

function ApiDemoPanel({ item }) {
  const state = useMe(item);
  const { params, response, clearResponse, setBody, makeFetch } = state;

  let finishedRequest = true;
  Object.values(params).forEach((paramList) => {
    paramList.forEach((param) => {
      if (param.required && !param.value) {
        finishedRequest = false;
      }
    });
  });

  return (
    <Context.Provider value={state}>
      <MethodEndpoint />

      {/* Options */}
      <div className={styles.optionsPanel}>
        <ParamOptions />

        {/* Content-Type dropdown */}
        {/* {item.requestBody?.content &&
          Object.keys(item.requestBody?.content).length > 0 && (
            <div className={styles.formItem}>
              <code>Content-Type</code>
              <div>
                <select
                  className={styles.selectInput}
                  value={state.contentType}
                  // onChange={handleContentTypeChange}
                >
                  {Object.keys(item.requestBody?.content).map((type) => {
                    return <option value={type}>{type}</option>;
                  })}
                </select>
              </div>
            </div>
          )} */}

        {/* Request body */}
        {(item.requestBody?.content?.['application/json'] ||
          item.requestBody?.content?.['application/xml']) && (
          <div className={styles.formItem}>
            <code>Body</code>
            <VSCode
              value={JSON.stringify(
                sampleFromSchema(
                  item.requestBody?.content?.['application/json']?.schema
                ),
                null,
                2
              )}
              language={state.contentType.replace('application/', '')}
              onChange={setBody}
            />
          </div>
        )}

        {/* Accept dropdown */}
        {/* {acceptArray.length > 0 && (
          <div className={styles.formItem}>
            <code>Accept</code>
            <div>
              <select
                className={styles.selectInput}
                value={accept || 'application/json'}
                onChange={handleAcceptChange}
              >
                {acceptArray.map((type) => {
                  return <option value={type}>{type}</option>;
                })}
              </select>
            </div>
          </div>
        )}*/}
      </div>

      {/* Curl */}
      <Curl />

      {/* Execute */}
      <button
        className={styles.executeButton}
        disabled={!finishedRequest}
        onClick={() => makeFetch()}
      >
        Execute
      </button>

      {/* Response */}
      {response !== undefined && (
        <div className={styles.floatingButton}>
          <button onClick={() => clearResponse()}>Clear</button>
          <pre
            style={{
              background: '#242526',
            }}
          >
            {response || 'No Response'}
          </pre>
        </div>
      )}
    </Context.Provider>
  );
}

export default ApiDemoPanel;
