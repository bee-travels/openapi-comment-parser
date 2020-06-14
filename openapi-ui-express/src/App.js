import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';

import DocSidebar from 'DocSidebar';
import DocItem from 'DocItem';

import styles from './App.module.css';

import './default-dark.css';
import { dereference } from 'x-dereference';
import Navbar from 'Navbar';
import DocPaginator from 'DocPaginator';

function slugify(string) {
  return string.toLowerCase().replace(/\s/g, '-');
}

function getPaths(spec) {
  let seen = new Map();
  return Object.entries(spec.paths)
    .map(([path, pathObj]) => {
      const entries = Object.entries(pathObj);
      return entries.map(([method, methodObj]) => {
        let baseId = slugify(methodObj.summary);
        let count = seen.get(baseId);

        // Random doesn't work because it needs to stay consistent.
        if (count) {
          baseId += `-${count}`;
          seen.set(baseId, count + 1);
        } else {
          seen.set(baseId, 1);
        }

        return {
          ...methodObj,
          method: method,
          path: path,
          hashId: baseId,
        };
      });
    })
    .flat();
}

function organizeSpec(spec) {
  const paths = getPaths(spec);
  // TODO: untagged go into default
  const tagged = spec.tags.map((tag) => {
    return {
      title: tag.name,
      description: tag.description,
      items: paths.filter((p) => p.tags && p.tags.includes(tag.name)),
    };
  });

  const all = [
    ...tagged,
    {
      title: 'API',
      description: '',
      items: paths.filter((p) => p.tags === undefined || p.tags.length === 0),
    },
  ];

  return all;
}

function findActivePage(pages, hash) {
  const index = pages.findIndex((page) =>
    page.items.find((item) => `#${item.hashId}` === hash)
  );
  return Math.max(0, index);
}

function Page({ spec }) {
  const location = useLocation();

  const order = organizeSpec(dereference(spec));

  const sidebar = order.map((x) => {
    return {
      items: x.items.map((y) => {
        return {
          href: `#${y.hashId}`,
          label: y.summary,
          type: 'link',
        };
      }),
      label: x.title,
      type: 'category',
    };
  });

  const activePage = findActivePage(order, location.hash);
  const activeSubPage = Math.max(
    order[activePage].items.findIndex(
      (page) => `#${page.hashId}` === location.hash
    ),
    0
  );

  const prevPage = order[activePage].items[activeSubPage - 1];
  const page = order[activePage].items[activeSubPage];
  const nextPage = order[activePage].items[activeSubPage + 1];

  const metadata = {};
  if (prevPage) {
    metadata.previous = {
      permalink: `#${prevPage.hashId}`,
      title: prevPage.summary,
    };
  }

  if (nextPage) {
    metadata.next = {
      permalink: `#${nextPage.hashId}`,
      title: nextPage.summary,
    };
  }

  return (
    <div className={styles.docPage}>
      {sidebar && (
        <div className={styles.docSidebarContainer}>
          <DocSidebar
            sidebar={sidebar}
            activePage={activePage}
            location={location}
            sidebarCollapsible
          />
        </div>
      )}
      <main className={styles.docMainContainer}>
        <div className="padding-vert--lg">
          <div className="container" id={`page-${activePage}`}>
            {/* <DocPageTitle page={order[activePage]} /> */}

            {!window.ONE_ITEM_PER_PAGE &&
              order[activePage].items.map((item) => {
                return <DocItem item={item} />;
              })}

            {window.ONE_ITEM_PER_PAGE && (
              <DocItem key={`${page.method}-${page.path}`} item={page} />
            )}
            {window.ONE_ITEM_PER_PAGE && (
              <div className="row">
                <div className="col">
                  <div className={styles.docItemContainer}>
                    <div className="margin-vert--lg">
                      <DocPaginator metadata={metadata} />
                    </div>
                  </div>
                </div>
                <div className="col col--5"></div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function App({ spec }) {
  const title = spec.info.title;
  const version = spec.info.version;
  document.title = title;
  document.querySelector("link[rel*='icon']").href = spec.info['x-logo'];
  const logo = {
    src: spec.info['x-logo'],
  };
  return (
    <Router>
      <Navbar
        title={title}
        version={version}
        logo={logo}
        github={spec.info['x-github']}
      />
      <div className="main-wrapper">
        <Page spec={spec} />
      </div>
    </Router>
  );
}

export default App;
