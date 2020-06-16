import React, { useRef, useState, useEffect } from 'react';

import cloneDeep from 'lodash/cloneDeep';

import codegen from 'postman-code-generators';
import sdk from 'postman-collection';

import { useSelector } from 'react-redux';

import { useTheme } from 'theme';

import styles from './styles.module.css';

const globalOptions = {
  followRedirect: true,
  trimRequestBody: true,
};

const languageSet = {
  js: {
    language: 'javascript',
    variant: 'fetch',
    options: {
      ...globalOptions,
    },
  },
  curl: {
    language: 'curl',
    variant: 'curl',
    options: {
      longFormat: false,
      ...globalOptions,
    },
  },
  go: {
    language: 'go',
    variant: 'native',
    options: {
      ...globalOptions,
    },
  },
  python: {
    language: 'python',
    variant: 'requests',
    options: {
      ...globalOptions,
    },
  },
  node: {
    language: 'nodejs',
    variant: 'axios',
    options: {
      ES6_enabled: true,
      ...globalOptions,
    },
  },
};

function setQueryParams(postman, queryParams) {
  postman.url.query.clear();

  const qp = queryParams
    .filter((param) => param.value)
    .map((param) => {
      if (Array.isArray(param.value)) {
        return new sdk.QueryParam({
          key: param.name,
          value: param.value.join(','),
        });
      }
      return new sdk.QueryParam({
        key: param.name,
        value: param.value,
      });
    });

  if (qp.length > 0) {
    postman.addQueryParams(qp);
  }
}

function setPathParams(postman, queryParams) {
  const source = queryParams.map((x) => ({
    key: x.name,
    value: x.value || `:${x.name}`,
  }));
  postman.url.variables.assimilate(source);
}

function buildCookie(cookieParams) {
  const cookies = cookieParams.map((param) => {
    if (param.value) {
      return new sdk.Cookie({
        name: param.name,
        value: param.value,
      });
    }
    return undefined;
  });
  const list = new sdk.CookieList(null, cookies);
  return list.toString();
}

function setHeaders(postman, contentType, accept, cookie, headerParams) {
  postman.headers.clear();
  if (contentType) {
    postman.addHeader({ key: 'Content-Type', value: contentType });
  }
  if (accept) {
    postman.addHeader({ key: 'Accept', value: accept });
  }
  headerParams.forEach((param) => {
    if (param.value) {
      postman.addHeader({ key: param.name, value: param.value });
    }
  });
  if (cookie) {
    postman.addHeader({ key: 'Cookie', value: cookie });
  }
}

function setBody(clonedPostman, body) {
  if (clonedPostman.body === undefined) {
    return;
  }
  switch (clonedPostman.body.mode) {
    case 'raw': {
      clonedPostman.body.raw = body || '';
      return;
    }
    case 'formdata': {
      clonedPostman.body.formdata.clear();
      if (body === undefined) {
        return;
      }
      const params = Object.entries(body)
        .filter(([_, val]) => val)
        .map(([key, val]) => new sdk.FormParam({ key: key, value: val }));
      clonedPostman.body.formdata.assimilate(params);
      return;
    }
    case 'urlencoded': {
      clonedPostman.body.urlencoded.clear();
      if (body === undefined) {
        return;
      }
      const params = Object.entries(body)
        .filter(([_, val]) => val)
        .map(([key, val]) => new sdk.QueryParam({ key: key, value: val }));
      clonedPostman.body.urlencoded.assimilate(params);
      return;
    }
    default:
      return;
  }
}

function Curl() {
  const { language, setLanguage } = useTheme();

  const [copyText, setCopyText] = useState('Copy');

  const pathParams = useSelector((state) => state.params.path);
  const queryParams = useSelector((state) => state.params.query);
  const cookieParams = useSelector((state) => state.params.cookie);
  const headerParams = useSelector((state) => state.params.header);
  const contentType = useSelector((state) => state.contentType);
  const body = useSelector((state) => state.body);
  const accept = useSelector((state) => state.accept);
  const postman = useSelector((state) => state.postman);

  const [codeText, setCodeText] = useState('');

  useEffect(() => {
    const clonedPostman = cloneDeep(postman);
    console.log(clonedPostman);

    clonedPostman.url.host = [window.location.origin];

    setQueryParams(clonedPostman, queryParams);
    setPathParams(clonedPostman, pathParams);

    const cookie = buildCookie(cookieParams);
    setHeaders(clonedPostman, contentType, accept, cookie, headerParams);

    setBody(clonedPostman, body);

    codegen.convert(
      languageSet[language].language,
      languageSet[language].variant,
      clonedPostman,
      languageSet[language].options,
      (error, snippet) => {
        if (error) {
          return;
        }
        setCodeText(snippet);
      }
    );
  }, [
    accept,
    body,
    contentType,
    cookieParams,
    headerParams,
    language,
    pathParams,
    postman,
    queryParams,
  ]);

  const ref = useRef(null);

  const handleCurlCopy = () => {
    setCopyText('Copied');
    setTimeout(() => {
      setCopyText('Copy');
    }, 2000);
    navigator.clipboard.writeText(ref.current.innerText);
  };

  return (
    <>
      <div className={styles.buttonGroup}>
        <button
          className={language === 'curl' && styles.selected}
          onClick={() => setLanguage('curl')}
        >
          cURL
        </button>
        <button
          className={language === 'node' && styles.selected}
          onClick={() => setLanguage('node')}
        >
          Node
        </button>
        <button
          className={language === 'go' && styles.selected}
          onClick={() => setLanguage('go')}
        >
          Go
        </button>
        <button
          className={language === 'python' && styles.selected}
          onClick={() => setLanguage('python')}
        >
          Python
        </button>
      </div>

      <div className="nick-floating-button">
        <button onClick={handleCurlCopy}>{copyText}</button>
        <pre
          style={{
            background: 'var(--ifm-codeblock-background-color)',
            paddingRight: '60px',
            borderRadius:
              'calc(var(--ifm-pre-border-radius) / 3) calc(var(--ifm-pre-border-radius) / 3) var(--ifm-pre-border-radius) var(--ifm-pre-border-radius)',
          }}
        >
          <code ref={ref}>
            {codeText.split("'").map((x, i) => {
              if (i % 2) {
                return (
                  <span key={i} style={{ color: 'var(--code-green)' }}>
                    '{x}'
                  </span>
                );
              }
              return <span key={i}>{x}</span>;
            })}
          </code>
        </pre>
      </div>
    </>
  );
}

export default Curl;
