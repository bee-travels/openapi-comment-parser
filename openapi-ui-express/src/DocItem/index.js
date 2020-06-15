import React from 'react';
import MD from 'react-markdown';

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
              {item.deprecated && (
                <div className="admonition admonition-caution alert alert--warning">
                  <div className="admonition-heading">
                    <h5>
                      <span className="admonition-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"
                          ></path>
                        </svg>
                      </span>
                      deprecated
                    </h5>
                  </div>
                  {item['x-deprecated-description'] && (
                    <div className="admonition-content">
                      <MD source={item['x-deprecated-description']} />
                    </div>
                  )}
                </div>
              )}
              <MD source={item.description} />
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
