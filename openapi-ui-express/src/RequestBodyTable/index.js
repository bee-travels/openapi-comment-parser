import React from 'react';

function RequestBodyTable({ body }) {
  if (body === undefined) {
    return null;
  }

  // TODO: support more than one content type.
  const randomFirstKey = Object.keys(body.content)[0];

  // too lazy to descide how to handle all content types.
  const firstBody = body.content[randomFirstKey];

  return (
    <>
      <table style={{ display: 'table' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>
              Request Body{' '}
              <div style={{ fontWeight: 'normal' }}>
                {/* {body.required && (
                  <span style={{ color: 'var(--code-red)' }}>required </span>
                )} */}
                {body.description}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {/* <tr>
            <td> */}
          {Object.entries(firstBody.schema.properties).map(([key, val]) => {
            return (
              <tr>
                <td>
                  <code>{key}</code>
                  <span style={{ color: 'var(--code-red)' }}>
                    {true ? '*' : ''}{' '}
                  </span>
                  <span style={{ opacity: '0.6' }}>{val.type}</span>
                </td>
              </tr>
            );
          })}
          {/* </td>
          </tr> */}
          {/* <tr>
            <td>
              Category
              <pre
                style={{
                  marginBottom: 0,
                  marginTop: 'var(--ifm-spacing-vertical)',
                }}
              >
                {'{\n  id: int64\n  name: string\n}'}
              </pre>
            </td>
          </tr>
          <tr>
            <td>
              Tag
              <pre
                style={{
                  marginBottom: 0,
                  marginTop: 'var(--ifm-spacing-vertical)',
                }}
              >
                {'{\n  id: int64\n  name: string\n}'}
              </pre>
            </td>
          </tr> */}
        </tbody>
      </table>
      <table style={{ display: 'table' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Category</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <pre
                style={{
                  marginBottom: 0,
                  marginTop: '0',
                }}
              >
                {'{\n  id: int64\n  name: string\n}'}
              </pre>
            </td>
          </tr>
        </tbody>
      </table>
      <table style={{ display: 'table' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Tag</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <pre
                style={{
                  marginBottom: 0,
                  marginTop: '0',
                }}
              >
                {'{\n  id: int64\n  name: string\n}'}
              </pre>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default RequestBodyTable;
