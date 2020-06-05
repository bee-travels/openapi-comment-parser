import React, { useState, useRef } from 'react';
import queryString from 'query-string';
// import MagicDropzone from 'react-magic-dropzone';

import VSCode from 'VSCode';
import Curl from 'Curl';
import { sampleFromSchema } from 'x-utils';

import styles from './styles.module.css';

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

function MethodPath({ method, path }) {
  return (
    <pre
      style={{
        marginTop: '3.5em',
        background: '#242526',
      }}
    >
      <span style={{ color: colorForMethod(method) }}>
        {method.toUpperCase()}
      </span>{' '}
      <span>{path.replace(/{([a-z0-9-_]+)}/gi, ':$1')}</span>
    </pre>
  );
}

function ParamOptions({ params }) {
  return (
    <>
      {params?.length > 0 &&
        params.map((param) => {
          return (
            <ParamTextFormItem
              param={param}
              value={groupedState[param.in][param.name] || ''}
              onChange={handleInputChange(param)}
            />
          );
        })}
    </>
  );
}

function ParamTextFormItem({ param, value, onChange }) {
  return (
    <div className={styles.formItem}>
      <code>{param.name}</code>
      <div>
        <input
          className={styles.input}
          type="text"
          placeholder={param.description}
          value={value}
          onChange={() => onChange(param)}
        />
      </div>
    </div>
  );
}

function ApiDemoPanel({ item }) {
  const acceptArray = [
    ...new Set(
      Object.values(item.responses)
        .map((val) => Object.keys(val?.content || {}))
        .flat()
    ),
  ];

  const [accept, setAccept] = useState(acceptArray[0]);
  const [contentType, setContentType] = useState(
    Object.keys(item.requestBody?.content || {})[0]
  );
  const [path, setPath] = useState({});
  const [query, setQuery] = useState({});
  const [header, setHeader] = useState({});
  const [cookie, setCookie] = useState({});
  const [response, setResponse] = useState(undefined);

  const [copyText, setCopyText] = useState('Copy');

  const [body, setBody] = useState(undefined);

  const curlRef = useRef(null);
  // console.log(curlRef);

  const requiredParams = item?.parameters?.filter((param) => param.required);
  const optionalParams = item?.parameters?.filter((param) => !param.required);

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

  const handleContentTypeChange = (e) => {
    setContentType(e.target.value);
  };

  const handleCurlCopy = () => {
    setCopyText('Copied');
    setTimeout(() => {
      setCopyText('Copy');
    }, 2000);
    navigator.clipboard.writeText(curlRef.current.innerText);
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

  const groupedState = { path, query, header, cookie };

  const hasOptions =
    item.requestBody?.content ||
    acceptArray.length > 0 ||
    requiredParams?.length > 0;

  return (
    <>
      <MethodPath method={item.method} path={item.path} />

      {/* Options */}
      {hasOptions && (
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
          <ParamOptions params={requiredParams} />

          {/* TODO: make this expand/collapsable */}
          <ParamOptions params={optionalParams} />

          {/* Content-Type dropdown */}
          {item.requestBody?.content &&
            Object.keys(item.requestBody?.content).length > 0 && (
              <div className={styles.formItem}>
                <code>Content-Type</code>
                <div>
                  <select
                    className={styles.selectInput}
                    value={contentType}
                    onChange={handleContentTypeChange}
                  >
                    {Object.keys(item.requestBody?.content).map((type) => {
                      return <option value={type}>{type}</option>;
                    })}
                  </select>
                </div>
              </div>
            )}

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
                language={contentType.replace('application/', '')}
                onChange={setBody}
              />

              {/* schema: string + binary */}
              {/* <MagicDropzone className={styles.dropzone} onDrop={() => {}}>
                    <div className={styles.dropzoneContent}>
                      {item.requestBody.description || 'file upload'}
                    </div>
                  </MagicDropzone> */}
              {/* TODO: form */}
              {/* TODO: anything else */}
            </div>
          )}

          {/* Accept dropdown */}
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

      {/* Curl */}
      <div className={styles.floatingButton}>
        <button onClick={handleCurlCopy}>{copyText}</button>
        <pre
          style={{
            background: '#242526',
            paddingRight: '60px',
          }}
        >
          <Curl
            theref={curlRef}
            item={item}
            path={path}
            query={query}
            header={header}
            cookie={cookie}
            accept={accept}
            contentType={contentType}
            body={body}
          />
        </pre>
      </div>

      {/* Execute */}
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

      {/* Response */}
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

export default ApiDemoPanel;
