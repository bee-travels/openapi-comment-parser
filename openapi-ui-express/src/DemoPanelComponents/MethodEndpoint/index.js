import React from 'react';

import { useSelector } from 'react-redux';

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
  const method = useSelector((state) => state.method);
  const endpoint = useSelector((state) => state.endpoint);

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
