import React, { useContext, useState } from 'react';

import Context from 'ApiDemoPanel/useMe';

import styles from './styles.module.css';

function ParamOptions() {
  const { params } = useContext(Context);
  const [showOptional, setShowOptional] = useState(false);
  const allParams = [
    ...params.path,
    ...params.query,
    ...params.cookie,
    ...params.header,
  ];
  const requiredParams = allParams.filter((p) => p.required);
  const optionalParams = allParams.filter((p) => !p.required);
  return (
    <>
      {requiredParams.map((param) => {
        return <ParamTextFormItem param={param} />;
      })}
      {optionalParams.length > 0 && (
        <>
          <button
            className={styles.showMoreButton}
            onClick={() => setShowOptional((prev) => !prev)}
          >
            <span
              style={{
                width: '1.5em',
                display: 'inline-block',
                textAlign: 'center',
              }}
            >
              {showOptional ? '-' : '+'}
            </span>
            {showOptional
              ? 'hide optional parameters'
              : 'show optional parameters'}
          </button>
          {showOptional && (
            <div>
              {optionalParams.map((param) => {
                return <ParamTextFormItem param={param} />;
              })}
            </div>
          )}
        </>
      )}
    </>
  );
}

function ParamTextFormItem({ param }) {
  const { updateParam } = useContext(Context);
  return (
    <div className="nick-form-item">
      <code>{param.name}</code>
      <span style={{ opacity: 0.6 }}> — {param.type}</span>
      <div>
        <input
          className={styles.input}
          type="text"
          placeholder={param.description || param.name}
          value={param.value}
          onChange={(e) => updateParam({ ...param, value: e.target.value })}
        />
      </div>
    </div>
  );
}

export default ParamOptions;
