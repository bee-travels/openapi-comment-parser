import React from 'react';

import Context, { useMe } from './useMe';
import MethodEndpoint from 'DemoPanelComponents/MethodEndpoint';
import ParamOptions from 'DemoPanelComponents/ParamOptions';
import Body from 'DemoPanelComponents/Body';
import Curl from 'DemoPanelComponents/Curl';
import Response from 'DemoPanelComponents/Response';
import Execute from 'DemoPanelComponents/Execute';
import Accept from 'DemoPanelComponents/Accept';
import ContentType from 'DemoPanelComponents/ContentType';

import styles from './styles.module.css';

function ApiDemoPanel({ item }) {
  const state = useMe(item);

  return (
    <Context.Provider value={state}>
      <MethodEndpoint />

      <div className={styles.optionsPanel}>
        <ParamOptions />
        <ContentType />
        <Body />
        <Accept />
      </div>

      <Curl />
      <Execute />
      <Response />
    </Context.Provider>
  );
}

export default ApiDemoPanel;
