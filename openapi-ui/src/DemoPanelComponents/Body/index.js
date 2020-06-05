import React, { useContext } from 'react';
import VSCode from 'DemoPanelComponents/VSCode';
import { sampleFromSchema } from 'x-utils';
import Context from 'ApiDemoPanel/useMe';

function Body() {
  const { contentType, setBody, requestBodyMetadata } = useContext(Context);

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
