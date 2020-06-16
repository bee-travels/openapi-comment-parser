import React, { useRef, useState, useEffect } from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';

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
    highlight: 'javascript',
    language: 'javascript',
    variant: 'fetch',
    options: {
      ...globalOptions,
    },
  },
  curl: {
    highlight: 'bash',
    language: 'curl',
    variant: 'curl',
    options: {
      longFormat: false,
      ...globalOptions,
    },
  },
  go: {
    highlight: 'go',
    language: 'go',
    variant: 'native',
    options: {
      ...globalOptions,
    },
  },
  python: {
    highlight: 'python',
    language: 'python',
    variant: 'requests',
    options: {
      ...globalOptions,
    },
  },
  node: {
    highlight: 'javascript',
    language: 'nodejs',
    variant: 'axios',
    options: {
      ES6_enabled: true,
      ...globalOptions,
    },
  },
};

const languageTheme = {
  plain: {
    color: 'var(--ifm-code-color)',
  },
  styles: [
    // {
    //   types: ['changed'],
    //   style: {
    //     color: 'rgb(162, 191, 252)',
    //     fontStyle: 'italic',
    //   },
    // },
    // {
    //   types: ['deleted'],
    //   style: {
    //     color: 'rgba(239, 83, 80, 0.56)',
    //     fontStyle: 'italic',
    //   },
    // },
    {
      types: ['inserted', 'attr-name'],
      style: {
        color: 'var(--code-green)',
        // color: 'rgb(173, 219, 103)',
        // fontStyle: 'italic',
      },
    },
    // {
    //   types: ['comment'],
    //   style: {
    //     color: 'rgb(99, 119, 119)',
    //     fontStyle: 'italic',
    //   },
    // },
    {
      types: ['string', 'url'],
      style: {
        color: 'var(--code-green)',
        // color: 'rgb(173, 219, 103)',
      },
    },
    // {
    //   types: ['variable'],
    //   style: {
    //     color: 'rgb(214, 222, 235)',
    //   },
    // },
    // {
    //   types: ['number'],
    //   style: {
    //     color: 'rgb(247, 140, 108)',
    //   },
    // },
    {
      types: ['builtin', 'char', 'constant', 'function'],
      style: {
        // color: 'rgb(130, 170, 255)',
        color: 'var(--code-blue)',
      },
    },
    {
      // This was manually added after the auto-generation
      // so that punctuations are not italicised
      types: ['punctuation', 'operator'], // +operator
      style: {
        // color: 'rgb(199, 146, 234)',
        color: '#7f7f7f',
      },
    },
    // {
    //   types: ['selector', 'doctype'],
    //   style: {
    //     color: 'rgb(199, 146, 234)',
    //     fontStyle: 'italic',
    //   },
    // },
    {
      types: ['class-name'],
      style: {
        // color: 'rgb(255, 203, 139)',
        color: 'var(--code-orange)',
      },
    },
    {
      types: ['tag', 'arrow', 'keyword'], // -operator, +arrow
      style: {
        // arrow is actually handled globally
        // color: 'rgb(127, 219, 202)',
        color: '#d9a0f9',
      },
    },
    {
      types: ['boolean'],
      style: {
        // color: 'rgb(255, 88, 116)',
        color: 'var(--code-red)',
      },
    },
    // {
    //   types: ['property'],
    //   style: {
    //     color: 'rgb(128, 203, 196)',
    //   },
    // },
    // {
    //   types: ['namespace'],
    //   style: {
    //     color: 'rgb(178, 204, 214)',
    //   },
    // },
  ],
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
  console.log(clonedPostman);
  console.log(clonedPostman.body.mode);
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
      if (typeof body !== 'object') {
        // treat it like raw.
        clonedPostman.body.mode = 'raw';
        clonedPostman.body.raw = body || '';
        return;
      }
      if (body.type === 'file') {
        // treat it like file.
        clonedPostman.body.mode = 'file';
        clonedPostman.body.file = { src: body.src };
        return;
      }
      const params = Object.entries(body)
        .filter(([_, val]) => val)
        .map(([key, val]) => {
          if (val.type === 'file') {
            return new sdk.FormParam({ key: key, ...val });
          }
          return new sdk.FormParam({ key: key, value: val });
        });
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
          className={language === 'curl' ? styles.selected : undefined}
          onClick={() => setLanguage('curl')}
        >
          cURL
        </button>
        <button
          className={language === 'node' ? styles.selected : undefined}
          onClick={() => setLanguage('node')}
        >
          Node
        </button>
        <button
          className={language === 'go' ? styles.selected : undefined}
          onClick={() => setLanguage('go')}
        >
          Go
        </button>
        <button
          className={language === 'python' ? styles.selected : undefined}
          onClick={() => setLanguage('python')}
        >
          Python
        </button>
      </div>

      <Highlight
        {...defaultProps}
        theme={languageTheme}
        code={codeText}
        language={languageSet[language].highlight}
      >
        {({ className, tokens, getLineProps, getTokenProps }) => (
          <div className="nick-floating-button">
            <button onClick={handleCurlCopy}>{copyText}</button>
            <pre
              className={className}
              style={{
                background: 'var(--ifm-codeblock-background-color)',
                paddingRight: '60px',
                borderRadius:
                  'calc(var(--ifm-pre-border-radius) / 3) calc(var(--ifm-pre-border-radius) / 3) var(--ifm-pre-border-radius) var(--ifm-pre-border-radius)',
              }}
            >
              <code ref={ref}>
                {tokens.map((line, i) => (
                  <span {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => {
                      if (token.types.includes('arrow')) {
                        token.types = ['arrow'];
                      }
                      return <span {...getTokenProps({ token, key })} />;
                    })}
                    {'\n'}
                  </span>
                ))}
              </code>
            </pre>
          </div>
        )}
      </Highlight>
    </>
  );
}

export default Curl;
