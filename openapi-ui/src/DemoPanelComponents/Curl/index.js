import React, { useRef, useState } from 'react';

import queryString from 'query-string';

import { useSelector } from 'react-redux';

function Curl() {
  const [copyText, setCopyText] = useState('Copy');

  const method = useSelector((state) => state.method);
  const endpoint = useSelector((state) => state.endpoint);
  const pathParams = useSelector((state) => state.params.path);
  const queryParams = useSelector((state) => state.params.query);
  const contentType = useSelector((state) => state.contentType);
  const body = useSelector((state) => state.body);
  const accept = useSelector((state) => state.accept);

  const ref = useRef(null);

  let query = {};
  queryParams.forEach((param) => {
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
    bodyString = JSON.stringify(JSON.stringify(JSON.parse(body)));
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
            curl -X <span>{method.toUpperCase()}</span> "
            {window.location.origin}
            {endpoint.replace(/{([a-z0-9-_]+)}/gi, (_, p1) => {
              return pathParams.find((p) => p.name === p1).value || `:${p1}`;
            })}
            {qs && '?'}
            {qs}"
          </span>

          {accept && (
            <>
              {' \\'}
              <br />
              <span>
                {' '}
                -H <span style={{ color: '#85d996' }}>"Accept: {accept}"</span>
              </span>
            </>
          )}

          {contentType && (
            <>
              {' \\'}
              <br />
              <span>
                {' '}
                -H{' '}
                <span style={{ color: '#85d996' }}>
                  "Content-Type: {contentType}"
                </span>
              </span>
            </>
          )}

          {body && (
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
