import React, { useContext } from 'react';
import Context from 'ApiDemoPanel/useMe';
import FormSelect from 'DemoPanelComponents/FormSelect';

function Accept() {
  const { acceptOptions, accept, setAccept } = useContext(Context);
  return (
    <FormSelect
      label="Accept"
      options={acceptOptions}
      value={accept}
      onChange={(e) => setAccept(e.target.value)}
    />
  );
}

export default Accept;
