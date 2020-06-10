import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Converter from 'openapi-to-postmanv2';
import sdk from 'postman-collection';
import ThemeProvider, { init as initializeTheme } from 'theme';

window.ONE_ITEM_PER_PAGE = true;
window.INJECT_POSTMAN = true;

// prevent flicker
initializeTheme();

fetch(process.env.PUBLIC_URL + '/spec.json')
  .then((r) => r.json())
  .then((spec) => {
    if (window.INJECT_POSTMAN) {
      const promise = new Promise((resolve, reject) => {
        Converter.convert(
          { type: 'json', data: spec },
          {},
          (_, conversionResult) => {
            if (!conversionResult.result) {
              reject(conversionResult.reason);
              return;
            } else {
              const myCollection = new sdk.Collection(
                conversionResult.output[0].data
              );
              myCollection.forEachItem((item) => {
                const method = item.request.method.toLowerCase();
                const path =
                  '/' +
                  item.request.url.path
                    .map((p) => {
                      if (p.startsWith(':')) {
                        return `{${p.slice(1)}}`;
                      }
                      return p;
                    })
                    .join('/');

                spec.paths[path][method].postman = item.request;
                resolve(spec);
                return;
              });
            }
          }
        );
      });
      return promise;
    }
    return spec;
  })
  .then((spec) => {
    ReactDOM.render(
      <React.StrictMode>
        <ThemeProvider>
          <App spec={spec} />
        </ThemeProvider>
      </React.StrictMode>,
      document.getElementById('root')
    );
  });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
