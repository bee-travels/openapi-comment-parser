import React, { useContext } from 'react';

import Context from 'ApiDemoPanel/useMe';

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

function MethodEndpoint() {
  const { method, endpoint } = useContext(Context);
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
      <span>{endpoint.replace(/{([a-z0-9-_]+)}/gi, ':$1')}</span>
    </pre>
  );
}

export default MethodEndpoint;
