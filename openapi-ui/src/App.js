import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SwaggerParser from '@apidevtools/swagger-parser';

import DocSidebar from 'DocSidebar';
import DocItem from 'DocItem';
import DocPageTitle from 'DocPageTitle';

import styles from './App.module.css';
import spec from './spec.json';

import './default-dark.css';

function slugify(string) {
  return string.toLowerCase().replace(/\s/g, '-');
}

function getPathsForTag(tag) {
  return Object.entries(spec.paths)
    .map(([path, pathObj]) => {
      const entries = Object.entries(pathObj);
      return entries.map(([method, methodObj]) => {
        return {
          ...methodObj,
          method: method,
          path: path,
        };
      });
    })
    .flat()
    .filter((x) => x.tags.includes(tag));
}

function organizeSpec(spec) {
  // TODO: untagged go into default
  return spec.tags.map((tag) => {
    return {
      title: tag.name,
      description: tag.description,
      items: getPathsForTag(tag.name),
    };
  });
}

function App() {
  const [order, setOrder] = useState(organizeSpec(spec));

  useEffect(() => {
    SwaggerParser.dereference(spec).then((api) => {
      console.log(api);
      // TODO: This ruins our variable names...
      setOrder(organizeSpec(api));
    });
  }, []);

  const docsSidebars = {
    default: order.map((x) => {
      return {
        items: x.items.map((y) => {
          return {
            href: `${slugify(y.summary)}`,
            label: y.summary,
            type: 'link',
          };
        }),
        label: x.title,
        type: 'category',
      };
    }),
  };
  const location = { pathname: window.location.pathname };
  const sidebar = 'default';
  const sidebarCollapsible = true;

  const activePage = 0;

  return (
    <Router>
      <Route path="/">
        <div className={styles.docPage}>
          {sidebar && (
            <div className={styles.docSidebarContainer}>
              <DocSidebar
                docsSidebars={docsSidebars}
                location={location}
                sidebar={sidebar}
                sidebarCollapsible={sidebarCollapsible}
              />
            </div>
          )}
          <main className={styles.docMainContainer}>
            <div className="padding-vert--lg">
              <div className="container">
                <DocPageTitle page={order[activePage]} />

                {order[activePage].items.map((item) => (
                  <DocItem item={item} />
                ))}
              </div>
            </div>
          </main>
        </div>
      </Route>
    </Router>
  );
}

export default App;
