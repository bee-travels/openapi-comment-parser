import React, { useRef, useState, useEffect } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import queryString from 'query-string';

import codegen from 'postman-code-generators';
import sdk from 'postman-collection';

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
  const postman = useSelector((state) => state.postman);

  const [codeText, setCodeText] = useState('');

  useEffect(() => {
    const clonedPostman = cloneDeep(postman);

    // const qp = queryParams
    //   .filter((param) => param.value)
    //   .map(
    //     (param) =>
    //       new sdk.QueryParam({ key: param.name, value: param.value.join(',') })
    //   );

    // if (qp.length > 0) {
    //   clonedPostman.addQueryParams(qp);
    // }

    clonedPostman.url.host = [window.location.origin];

    if (clonedPostman.body && clonedPostman.body.mode === 'raw') {
      clonedPostman.body.raw = body || '';
    }

    codegen.convert(
      'curl',
      'curl',
      clonedPostman,
      {
        longFormat: false,
        followRedirect: false,
        trimRequestBody: true,
      },
      (error, snippet) => {
        if (error) {
          return;
        }
        setCodeText(snippet);
      }
    );
  }, [body, contentType, postman, queryParams]);

  const ref = useRef(null);

  const handleCurlCopy = () => {
    setCopyText('Copied');
    setTimeout(() => {
      setCopyText('Copy');
    }, 2000);
    navigator.clipboard.writeText(ref.current.innerText);
  };

  return (
    <div className="nick-floating-button">
      <button onClick={handleCurlCopy}>{copyText}</button>
      <pre
        style={{
          background: 'var(--ifm-codeblock-background-color)',
          paddingRight: '60px',
        }}
      >
        <code ref={ref}>
          {codeText.split("'").map((x, i) => {
            if (i % 2) {
              return <span style={{ color: 'var(--code-green)' }}>'{x}'</span>;
            }
            return <span>{x}</span>;
          })}
        </code>
      </pre>
    </div>
  );
}

export default Curl;
