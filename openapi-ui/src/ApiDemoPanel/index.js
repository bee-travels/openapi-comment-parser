import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import reducer from 'redux/reducer';
import init from 'redux/init';
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
  const store = createStore(reducer, init(item));

  return (
    <Provider store={store}>
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
    </Provider>
  );
}

export default ApiDemoPanel;
