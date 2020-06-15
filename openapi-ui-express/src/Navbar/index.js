/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useCallback } from 'react';

import Toggle from 'Toggle';

import classnames from 'classnames';

import styles from './styles.module.css';
import { useTheme } from 'theme';

function Navbar({ title, logo, github, version }) {
  const sidebarShown = false;
  const isSearchBarExpanded = false;
  const { theme, setDarkMode, setLightMode } = useTheme();

  const baseUrl = '';
  const logoUrl = logo.src;

  const onToggleChange = useCallback(
    (e) => {
      if (e.target.checked) {
        setDarkMode();
      } else {
        setLightMode();
      }
    },
    [setDarkMode, setLightMode]
  );

  return (
    <>
      <nav
        className={classnames('navbar', 'navbar--light', 'navbar--fixed-top', {
          'navbar-sidebar--show': sidebarShown,
        })}
      >
        <div className="navbar__inner">
          <div className="navbar__items">
            <span className="navbar__brand" href={baseUrl}>
              {logo != null && (
                <img className="navbar__logo" src={logoUrl} alt={logo.alt} />
              )}
              {title != null && (
                <strong
                  className={isSearchBarExpanded ? styles.hideLogoText : ''}
                >
                  {title}
                </strong>
              )}
            </span>
            <span>{version}</span>
          </div>
          <div className="navbar__items navbar__items--right">
            {github && (
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="navbar__item navbar__link header-github-link"
                aria-label="GitHub repository"
              ></a>
            )}

            <Toggle
              className={styles.displayOnlyInLargeViewport}
              aria-label="Dark mode toggle"
              checked={theme === 'dark'}
              onChange={onToggleChange}
            />
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
