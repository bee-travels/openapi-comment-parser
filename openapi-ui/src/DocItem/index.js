import React from 'react';

import styles from './styles.module.css';

function DocItem(props) {
  const { metadata, content: DocContent, right: TryItOut } = props;
  const { title } = metadata;

  return (
    <>
      <div className="padding-vert--lg">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className={styles.docItemContainer}>
                <article>
                  <header>
                    <h1 className={styles.docTitle}>{title}</h1>
                  </header>
                </article>
              </div>
            </div>
            <div className="col col--5"></div>
          </div>

          <div className="row">
            <div className="col">
              <div className={styles.docItemContainer}>
                <article>
                  <div className="markdown">
                    <DocContent />
                  </div>
                </article>
              </div>
            </div>
            <div className="col col--5">
              <TryItOut />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <div className={styles.docItemContainer}>
                <article>
                  <div className="markdown">
                    <div>bleep</div>
                  </div>
                </article>
              </div>
            </div>
            <div className="col col--5">
              <div>bloop</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DocItem;
