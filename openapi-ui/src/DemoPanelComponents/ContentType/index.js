import React, { useContext } from 'react';
import Context from 'ApiDemoPanel/useMe';
import FormSelect from 'DemoPanelComponents/FormSelect';

function ContentType() {
  const { contentTypeOptions, contentType, setContentType } = useContext(
    Context
  );
  return (
    <FormSelect
      label="Content-Type"
      options={contentTypeOptions}
      value={contentType}
      onChange={(e) => setContentType(e.target.value)}
    />
  );
}

export default ContentType;
