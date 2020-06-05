import React from 'react';

import queryString from 'query-string';

function Curl({
  theref,
  item,
  path,
  query,
  header,
  cookie,
  accept,
  body,
  contentType,
}) {
  const qs = queryString.stringify(query);

  let bodyString;
  try {
    bodyString = JSON.stringify(JSON.stringify(JSON.parse(body)));
  } catch {
    bodyString = '"{}"';
  }

  return (
    <code ref={theref}>
      <span>
        curl -X <span>{item.method.toUpperCase()}</span> "
        {window.location.origin}
        {item.path.replace(/{([a-z0-9-_]+)}/gi, (_, p1) => {
          return path[p1] || `:${p1}`;
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
  );
}

export default Curl;
