import React from 'react';
import VSCode from 'DemoPanelComponents/VSCode';
import { sampleFromSchema } from 'x-utils';
import { useSelector } from 'react-redux';
import { useActions } from 'redux/actions';

function Body() {
  const contentType = useSelector((state) => state.contentType);
  const requestBodyMetadata = useSelector((state) => state.requestBodyMetadata);
  const { setBody } = useActions();

  console.log(requestBodyMetadata);

  if (contentType !== 'application/json' && contentType !== 'application/xml') {
    return null;
  }

  return (
    <div className="nick-form-item">
      <code>Body</code>
      <VSCode
        value={JSON.stringify(
          sampleFromSchema(
            requestBodyMetadata?.content?.['application/json']?.schema
          ),
          null,
          2
        )}
        language={contentType.replace('application/', '')}
        onChange={setBody}
      />
    </div>
  );
}

export default Body;
