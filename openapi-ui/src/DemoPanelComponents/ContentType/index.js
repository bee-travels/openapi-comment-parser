import React from 'react';
import FormSelect from 'DemoPanelComponents/FormSelect';
import { useSelector } from 'react-redux';
import { useActions } from 'redux/actions';

function ContentType() {
  const contentTypeOptions = useSelector((state) => state.contentTypeOptions);
  const contentType = useSelector((state) => state.contentType);
  const { setContentType } = useActions();

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
