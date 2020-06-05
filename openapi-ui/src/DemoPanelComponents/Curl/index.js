import React, { useRef, useState, useContext } from 'react';

import queryString from 'query-string';

import Context from 'ApiDemoPanel/useMe';

function Curl() {
  const state = useContext(Context);
  const ref = useRef(null);
  const [copyText, setCopyText] = useState('Copy');

  let query = {};
  state.params.query.forEach((param) => {
    if (param.value) {
      query[param.name] = param.value;
    }
  });

  const qs = queryString.stringify(query);

  const handleCurlCopy = () => {
    setCopyText('Copied');
    setTimeout(() => {
      setCopyText('Copy');
    }, 2000);
    navigator.clipboard.writeText(ref.current.innerText);
  };

  let bodyString;
  try {
    bodyString = JSON.stringify(JSON.stringify(JSON.parse(state.body)));
  } catch {
    bodyString = '"{}"';
  }

  return (
    <div className="nick-floating-button">
      <button onClick={handleCurlCopy}>{copyText}</button>
      <pre
        style={{
          background: '#242526',
          paddingRight: '60px',
        }}
      >
        <code ref={ref}>
          <span>
            curl -X <span>{state.method.toUpperCase()}</span> "
            {window.location.origin}
            {state.endpoint.replace(/{([a-z0-9-_]+)}/gi, (_, p1) => {
              return (
                state.params.path.find((p) => p.name === p1).value || `:${p1}`
              );
            })}
            {qs && '?'}
            {qs}"
          </span>

          {state.accept && (
            <>
              {' \\'}
              <br />
              <span>
                {' '}
                -H{' '}
                <span style={{ color: '#85d996' }}>
                  "Accept: {state.accept}"
                </span>
              </span>
            </>
          )}

          {state.contentType && (
            <>
              {' \\'}
              <br />
              <span>
                {' '}
                -H{' '}
                <span style={{ color: '#85d996' }}>
                  "Content-Type: {state.contentType}"
                </span>
              </span>
            </>
          )}

          {state.body && (
            <>
              {' \\'}
              <br />
              <span>
                {' '}
                -d <span style={{ color: '#85d996' }}>{bodyString}</span>
              </span>
            </>
          )}
        </code>
      </pre>
    </div>
  );
}

export default Curl;
