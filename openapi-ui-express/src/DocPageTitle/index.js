import React from 'react';

import styles from './styles.module.css';

function DocPageTitle({ page }) {
  return (
    <div className="row">
      <div className="col">
        <div className={styles.docItemContainer}>
          <article>
            <header>
              <h1 className={styles.docTitle}>{page.title}</h1>
            </header>
            <p>{page.description}</p>
          </article>
        </div>
      </div>
      <div className="col col--5"></div>
    </div>
  );
}

export default DocPageTitle;
