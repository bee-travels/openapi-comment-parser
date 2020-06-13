import React from 'react';
import VSCode from 'DemoPanelComponents/VSCode';
import FormTextInput from 'DemoPanelComponents/FormTextInput';
import FormFileUpload from 'DemoPanelComponents/FormFileUpload';
import { sampleFromSchema, createXMLExample } from 'x-utils';
import { useSelector } from 'react-redux';
import { useActions } from 'redux/actions';
import FormItem from 'DemoPanelComponents/FormItem';

function Body() {
  const contentType = useSelector((state) => state.contentType);
  const requestBodyMetadata = useSelector((state) => state.requestBodyMetadata);
  const thingID = useSelector((state) => `${state.method} ${state.endpoint}`);
  const { setBody } = useActions();

  // Lot's of possible content-types:
  // - application/json
  // - application/xml
  // - text/plain
  // - text/css
  // - text/html
  // - text/javascript
  // - application/javascript
  // - multipart/form-data
  // - application/x-www-form-urlencoded
  // - image/svg+xml;charset=US-ASCII

  // Show editor:
  // - application/json
  // - application/xml
  // - */*

  // Show form:
  // - multipart/form-data
  // - application/x-www-form-urlencoded

  // No body
  if (contentType === undefined) {
    return null;
  }

  if (
    contentType === 'multipart/form-data' ||
    contentType === 'application/x-www-form-urlencoded'
  ) {
    console.log(requestBodyMetadata);
    return (
      <div className="nick-form-item">
        <code>Body</code>
        <div
          style={{
            marginTop: 'calc(var(--ifm-pre-padding) / 2)',
            borderRadius: '4px',
            padding: 'var(--ifm-pre-padding)',
            border: '1px solid var(--monaco-border-color)',
          }}
        >
          {Object.entries(
            requestBodyMetadata?.content?.[contentType]?.schema.properties
          ).map(([key, val]) => {
            if (val.format === 'binary') {
              return (
                <FormItem label={key}>
                  <FormFileUpload placeholder={val.description || key} />
                </FormItem>
              );
            }
            return (
              <FormItem label={key}>
                <FormTextInput placeholder={val.description || key} />
              </FormItem>
            );
          })}
        </div>
      </div>
    );
  }

  let language = contentType.replace('application/', '');
  let exampleBodyString = '';
  if (contentType === 'application/json') {
    exampleBodyString = JSON.stringify(
      sampleFromSchema(
        requestBodyMetadata?.content?.['application/json']?.schema
      ),
      null,
      2
    );
    language = 'json';
  }

  if (contentType === 'application/xml') {
    exampleBodyString = createXMLExample(
      requestBodyMetadata?.content?.['application/xml']?.schema
    ).replace(/\t/g, '  ');
    language = 'xml';
  }

  return (
    <FormItem label="Body">
      <VSCode
        key={thingID}
        value={exampleBodyString}
        language={language}
        onChange={setBody}
      />
    </FormItem>
  );
}

export default Body;
