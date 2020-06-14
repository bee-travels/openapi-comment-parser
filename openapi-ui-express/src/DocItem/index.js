import React from 'react';

import ApiDemoPanel from 'ApiDemoPanel';
import ParamsTable from 'ParamsTable';
import StatusCodesTable from 'StatusCodesTable';

import styles from './styles.module.css';
import RequestBodyTable from 'RequestBodyTable';

function DocItem({ item }) {
  return (
    <div
      id={window.ONE_ITEM_PER_PAGE ? undefined : item.hashId}
      className="row"
    >
      <div className="col">
        <div className={styles.docItemContainer}>
          <article>
            <header>
              <h1 className={styles.docTitle}>{item.summary}</h1>
            </header>
            <div className="markdown">
              <p>{item.description}</p>
              <ParamsTable parameters={item.parameters} type="path" />
              <ParamsTable parameters={item.parameters} type="query" />
              <ParamsTable parameters={item.parameters} type="header" />
              <ParamsTable parameters={item.parameters} type="cookie" />

              <RequestBodyTable body={item.requestBody} />

              <StatusCodesTable responses={item.responses} />
            </div>
          </article>
        </div>
      </div>
      <div className="col col--5">
        <ApiDemoPanel item={item} />
      </div>
    </div>
  );
}

export default DocItem;
