import React from 'react';

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
                    {/* TODO: update to support CommonMark */}
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

export default StatusCodesTable;
