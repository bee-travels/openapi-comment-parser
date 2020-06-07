import React from 'react';
import VSCode from 'DemoPanelComponents/VSCode';
import { sampleFromSchema, createXMLExample } from 'x-utils';
import { useSelector } from 'react-redux';
import { useActions } from 'redux/actions';

function Body() {
  const contentType = useSelector((state) => state.contentType);
  const requestBodyMetadata = useSelector((state) => state.requestBodyMetadata);
  const { setBody } = useActions();

  if (contentType === 'application/json') {
    const exampleBodyString = JSON.stringify(
      sampleFromSchema(
        requestBodyMetadata?.content?.['application/json']?.schema
      ),
      null,
      2
    );
    return (
      <div className="nick-form-item">
        <code>Body</code>
        <VSCode
          value={exampleBodyString}
          language={contentType.replace('application/', '')}
          onChange={setBody}
        />
      </div>
    );
  }

  if (contentType === 'application/xml') {
    const exampleBodyString = createXMLExample(
      requestBodyMetadata?.content?.['application/xml']?.schema
    );
    return (
      <div className="nick-form-item">
        <code>Body</code>
        <VSCode
          value={exampleBodyString}
          language={contentType.replace('application/', '')}
          onChange={setBody}
        />
      </div>
    );
  }

  return null;
}

export default Body;
