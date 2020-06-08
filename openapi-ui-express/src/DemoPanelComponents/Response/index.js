import React from 'react';
import { useSelector } from 'react-redux';
import { useActions } from 'redux/actions';

function Response() {
  const response = useSelector((state) => state.response);
  const { clearResponse } = useActions();

  if (response === undefined) {
    return null;
  }

  return (
    <div className="nick-floating-button">
      <button onClick={() => clearResponse()}>Clear</button>
      <pre
        style={{
          background: '#242526',
        }}
      >
        {response || 'No Response'}
      </pre>
    </div>
  );
}

export default Response;
