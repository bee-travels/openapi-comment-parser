import React, { useState } from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import MagicDropzone from 'react-magic-dropzone';
// import Editor from 'react-monaco-editor';
import Editor, { monaco } from '@monaco-editor/react';

import queryString from 'query-string';

import DocSidebar from './DocSidebar';

import styles from './App.module.css';

import spec from './spec.json';

import './default-dark.css';

monaco
  .init()
  .then((monaco) => {
    /* here is the instance of monaco, so you can use the `monaco.languages` or whatever you want */
    monaco.editor.defineTheme('myCustomTheme', {
      base: 'vs-dark',
      inherit: false,
      rules: [
        { token: '', foreground: '7f7f7f' },
        // { token: 'string.key.json', foreground: 'd4d4d4' },
        { token: 'string.key.json', foreground: 'f5f6f7' },
        { token: 'string.value.json', foreground: '85d996' },
        { token: 'number', foreground: 'a4cdfe' },
      ],
      colors: {
        // 'editor.background': '#393939',
        // 'editor.lineHighlightBackground': '#393939',
        // 'editorBracketMatch.background': '#393939',
        // 'editorBracketMatch.border': '#393939',
        // 'editor.selectionBackground': '#515151',

        // 'editor.lineHighlightBackground': '#313131',
        // 'editor.selectionBackground': '#616161',

        // 'editor.lineHighlightBackground': '#414141',
        // 'editor.lineHighlightBackground': '#393939',
        // 'editor.selectionBackground': '#515151',

        // 'editorIndentGuide.background': '#515151',

        // 'editor.lineHighlightBackground': '#353535',
        // 'editor.selectionBackground': '#515151',
        //2e2f2f
        //363636

        'editor.background': '#18191a',
        'editor.lineHighlightBackground': '#18191a',
        'editorBracketMatch.background': '#18191a',
        'editorBracketMatch.border': '#18191a',
        'editor.selectionBackground': '#515151',
      },
    });
  })
  .catch((error) =>
    console.error('An error occurred during initialization of Monaco: ', error)
  );

function colorForMethod(method) {
  switch (method.toLowerCase()) {
    case 'get':
      return '#a4cdfe';
    case 'put':
      return '#f8b886';
    case 'post':
      return '#85d996';
    case 'delete':
      return '#ff83c0';
    default:
      return undefined;
  }
}

function slugify(string) {
  return string.toLowerCase().replace(/\s/g, '-');
}

function parseFinalSchema(schema) {
  if (schema.$ref) {
    return schema.$ref.replace('#/components/schemas/', '');
  }
  if (schema.format) {
    return schema.format;
  }
  return schema.type;
}

function getSchemaName(schema) {
  if (schema.type === 'array') {
    return parseFinalSchema(schema.items) + '[]';
  }

  return parseFinalSchema(schema);
}

function getPathsForTag(tag) {
  return Object.entries(spec.paths)
    .map(([path, pathObj]) => {
      const entries = Object.entries(pathObj);
      return entries.map(([method, methodObj]) => {
        return {
          ...methodObj,
          method: method,
          path: path,
        };
      });
    })
    .flat()
    .filter((x) => x.tags.includes(tag));
}

function organizeSpec(spec) {
  // TODO: untagged go into default
  return spec.tags.map((tag) => {
    return {
      title: tag.name,
      description: tag.description,
      items: getPathsForTag(tag.name),
    };
  });
}

function Curl({ item, path, query, header, cookie, accept }) {
  const multiline = accept !== undefined;

  const qs = queryString.stringify(query);

  return (
    <>
      <div>
        curl -X <span>{item.method.toUpperCase()}</span> "
        {window.location.origin}
        {item.path.replace(/{([a-z0-9-_]+)}/gi, (_, p1) => {
          return path[p1] || `:${p1}`;
        })}
        {qs && '?'}
        {qs}" {multiline && '\\'}
      </div>
      {accept && (
        <div>
          {'  '}-H <span style={{ color: '#85d996' }}>"accept: {accept}"</span>
        </div>
      )}
    </>
  );
}

function MethodPath({ method, path }) {
  return (
    <>
      <span style={{ color: colorForMethod(method) }}>
        {method.toUpperCase()}
      </span>{' '}
      <span>{path.replace(/{([a-z0-9-_]+)}/gi, ':$1')}</span>
    </>
  );
}

function StatusCodesTable({ responses }) {
  // openapi requires at least one response, so we shouldn't HAVE to check...
  if (responses === undefined) {
    return null;
  }
  const codes = Object.keys(responses);
  if (codes.length === 0) {
    return null;
  }
  return (
    <>
      <table style={{ display: 'table' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Status Codes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {codes.map((code) => {
                return (
                  <div>
                    <code>{code}</code> {responses[code].description}
                  </div>
                );
              })}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function ParamsTable({ parameters, type }) {
  if (parameters === undefined) {
    return null;
  }
  const params = parameters.filter((param) => param.in === type);
  if (params.length === 0) {
    return null;
  }
  return (
    <>
      <table style={{ display: 'table' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>
              {type.charAt(0).toUpperCase() + type.slice(1)} Parameters
            </th>
          </tr>
        </thead>
        <tbody>
          {params.map((param) => {
            return (
              <tr>
                <td>
                  <code>{param.name}</code>
                  <span style={{ color: '#ff83c0' }}>
                    {param.required ? '*' : ''}{' '}
                  </span>
                  <span style={{ opacity: '0.6' }}>
                    {getSchemaName(param.schema)}
                  </span>
                  <div>{param.description}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function TryItOut({ item }) {
  const acceptArray = [
    ...new Set(
      Object.values(item.responses)
        .map((val) => Object.keys(val?.content || {}))
        .flat()
    ),
  ];

  const [accept, setAccept] = useState(acceptArray[0]);
  const [path, setPath] = useState({});
  const [query, setQuery] = useState({});
  const [header, setHeader] = useState({});
  const [cookie, setCookie] = useState({});
  const [response, setResponse] = useState(undefined);

  const [editorFocused, setEditorFocused] = useState(false);

  const [copyText, setCopyText] = useState('Copy');

  const requiredParams = item?.parameters?.filter((param) => param.required);

  let finishedRequest = true;
  if (requiredParams) {
    requiredParams.forEach((param) => {
      switch (param.in) {
        case 'path':
          if (!path[param.name]) {
            finishedRequest = false;
          }
          break;
        case 'query':
          if (!query[param.name]) {
            finishedRequest = false;
          }
          break;
        case 'header':
          if (!header[param.name]) {
            finishedRequest = false;
          }
          break;
        case 'cookie':
          if (!cookie[param.name]) {
            finishedRequest = false;
          }
          break;
      }
    });
  }

  const handleInputChange = (param) => (e) => {
    switch (param.in) {
      case 'path':
        setPath({ ...path, [param.name]: e.target.value });
        break;
      case 'query':
        setQuery({ ...query, [param.name]: e.target.value });
        break;
      case 'header':
        setHeader({ ...header, [param.name]: e.target.value });
        break;
      case 'cookie':
        setCookie({ ...cookie, [param.name]: e.target.value });
        break;
    }
  };

  const handleAcceptChange = (e) => {
    setAccept(e.target.value);
  };

  const handleCurlCopy = (item, path, query, header, cookie, accept) => (e) => {
    setCopyText('Copied');
    setTimeout(() => {
      setCopyText('Copy');
    }, 2000);
    const qs = queryString.stringify(query);

    const x = `curl -X ${item.method.toUpperCase()} "${
      window.location.origin
    }${item.path.replace(/{([a-z0-9-_]+)}/gi, (_, p1) => {
      return path[p1] || `:${p1}`;
    })}${qs && '?'}${qs}"${accept && ` -H "accept: ${accept}"`}`;

    navigator.clipboard.writeText(x);
  };

  async function buildAndExecute(item, path, query, header, cookie, accept) {
    const url = item.path.replace(/{([a-z0-9-_]+)}/gi, (_, p1) => {
      return path[p1] || `:${p1}`;
    });

    const fullPath = queryString.stringifyUrl({ url: url, query: query });

    const response = await fetch(fullPath, {
      method: item.method.toUpperCase(),
      headers: {
        Accept: accept,
      },
    });

    const text = await response.text();
    setResponse(text);
  }

  // TODO: Names might not be unique across types.
  const groupedState = { path, query, header, cookie };

  return (
    <>
      <pre
        style={{
          marginTop: '3.5em',
          background: '#242526',
        }}
      >
        <MethodPath method={item.method} path={item.path} />
      </pre>

      {(item.requestBody?.content ||
        acceptArray.length > 0 ||
        requiredParams?.length > 0) && (
        <div
          style={{
            background: '#242526',
            borderRadius: 'var(--ifm-pre-border-radius)',
            color: 'var(--ifm-pre-color)',
            lineHeight: 'var(--ifm-pre-line-height)',
            marginBottom: 'var(--ifm-spacing-vertical)',
            marginTop: '0',
            overflow: 'auto',
            padding: 'var(--ifm-pre-padding)',
          }}
        >
          <>
            {requiredParams?.length > 0 &&
              requiredParams.map((param) => {
                return (
                  <div className={styles.formItem}>
                    <code>{param.name}</code>
                    <div>
                      <input
                        className={styles.input}
                        type="text"
                        placeholder={param.description}
                        value={groupedState[param.in][param.name] || ''}
                        onChange={handleInputChange(param)}
                      />
                    </div>
                  </div>
                );
              })}
          </>

          {/* TODO: Optional params */}

          <>
            {item.requestBody?.content && (
              <div className={styles.formItem}>
                <code>Body</code>
                <div
                  className={
                    editorFocused
                      ? 'nick-monaco-padding-focus'
                      : 'nick-monaco-padding'
                  }
                >
                  {/* monaco */}
                  <Editor
                    value={JSON.stringify({ example: 'thing' }, null, 2)}
                    language="json"
                    theme="myCustomTheme"
                    height="200px"
                    options={{
                      contentLeft: 0,
                      lineNumbers: 'off',
                      scrollBeyondLastLine: false,
                      scrollBeyondLastColumn: 3,
                      readOnly: false,
                      minimap: { enabled: false },
                      fontFamily:
                        'SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
                      fontSize: '14.4',
                      overviewRulerLanes: 0,
                      folding: false,
                      lineDecorationsWidth: 0,
                      contextmenu: false,
                    }}
                    editorDidMount={(_, editor) => {
                      editor.onDidFocusEditorText(() => {
                        setEditorFocused(true);
                      });
                      editor.onDidBlurEditorText(() => {
                        setEditorFocused(false);
                      });
                    }}
                  />

                  {/* <MagicDropzone className={styles.dropzone} onDrop={() => {}}>
                    <div className={styles.dropzoneContent}>
                      {item.requestBody.description || 'file upload'}
                    </div>
                  </MagicDropzone> */}
                </div>
              </div>
            )}
          </>

          {acceptArray.length > 0 && (
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
          )}
        </div>
      )}
      <div className={styles.floatingButton}>
        <button
          onClick={handleCurlCopy(item, path, query, header, cookie, accept)}
        >
          {copyText}
        </button>
        <pre
          style={{
            background: '#242526',
          }}
        >
          <Curl
            item={item}
            path={path}
            query={query}
            header={header}
            cookie={cookie}
            accept={accept}
          />
        </pre>
      </div>

      <button
        // class="button button--block button--primary"
        className={styles.executeButton}
        disabled={!finishedRequest}
        onClick={() =>
          buildAndExecute(item, path, query, header, cookie, accept)
        }
      >
        Execute
      </button>

      {response !== undefined && (
        <div className={styles.floatingButton}>
          <button onClick={() => setResponse(undefined)}>Clear</button>
          <pre
            style={{
              background: '#242526',
            }}
          >
            {response || 'No Response'}
          </pre>
        </div>
      )}
    </>
  );
}

function App() {
  const order = organizeSpec(spec);

  const docsSidebars = {
    default: order.map((x) => {
      return {
        items: x.items.map((y) => {
          return {
            href: `${slugify(y.summary)}`,
            label: y.summary,
            type: 'link',
          };
        }),
        label: x.title,
        type: 'category',
      };
    }),
  };
  const location = { pathname: window.location.pathname };
  const sidebar = 'default';
  const sidebarCollapsible = true;

  const activePage = 0;

  return (
    <Router>
      <Route path="/">
        <div className={styles.docPage}>
          {sidebar && (
            <div className={styles.docSidebarContainer}>
              <DocSidebar
                docsSidebars={docsSidebars}
                location={location}
                sidebar={sidebar}
                sidebarCollapsible={sidebarCollapsible}
              />
            </div>
          )}
          <main className={styles.docMainContainer}>
            <div className="padding-vert--lg">
              <div className="container">
                <div className="row">
                  <div className="col">
                    <div className={styles.docItemContainer}>
                      <article>
                        <header>
                          <h1 className={styles.docTitle}>
                            {order[activePage].title}
                          </h1>
                        </header>
                        <p>{order[activePage].description}</p>
                      </article>
                    </div>
                  </div>
                  <div className="col col--5"></div>
                </div>

                <>
                  {order[activePage].items.map((item) => {
                    return (
                      <div className="row">
                        <div className="col">
                          <div className={styles.docItemContainer}>
                            <article>
                              <div className="markdown">
                                <h2>{item.summary}</h2>
                                <p>{item.description}</p>
                                <ParamsTable
                                  parameters={item.parameters}
                                  type="path"
                                />
                                <ParamsTable
                                  parameters={item.parameters}
                                  type="query"
                                />
                                <ParamsTable
                                  parameters={item.parameters}
                                  type="header"
                                />
                                <ParamsTable
                                  parameters={item.parameters}
                                  type="cookie"
                                />

                                <StatusCodesTable responses={item.responses} />
                              </div>
                            </article>
                          </div>
                        </div>
                        <div className="col col--5">
                          <TryItOut item={item} />
                        </div>
                      </div>
                    );
                  })}
                </>
              </div>
            </div>
          </main>
        </div>
      </Route>
    </Router>
  );
}

export default App;
