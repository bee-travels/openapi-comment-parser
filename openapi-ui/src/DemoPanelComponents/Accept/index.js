import React from 'react';
import FormSelect from 'DemoPanelComponents/FormSelect';
import { useSelector } from 'react-redux';
import { useActions } from 'redux/actions';

function Accept() {
  const acceptOptions = useSelector((state) => state.acceptOptions);
  const accept = useSelector((state) => state.accept);
  const { setAccept } = useActions();

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
