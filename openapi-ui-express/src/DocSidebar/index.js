/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import classnames from 'classnames';

import styles from './styles.module.css';

const MOBILE_TOGGLE_SIZE = 24;

function DocSidebarItem({ item, onItemClick, collapsible, active, location }) {
  const { items, label } = item;
  const [collapsed, setCollapsed] = useState(item.collapsed);
  const [prevCollapsedProp, setPreviousCollapsedProp] = useState(null);

  // If the collapsing state from props changed, probably a navigation event
  // occurred. Overwrite the component's collapsed state with the props'
  // collapsed value.
  if (item.collapsed !== prevCollapsedProp) {
    setPreviousCollapsedProp(item.collapsed);
    setCollapsed(item.collapsed);
  }

  const handleItemClick = (e) => {
    e.preventDefault();
    setCollapsed((state) => !state);
  };

  return (
    items.length > 0 && (
      <li
        className={classnames('menu__list-item', {
          'menu__list-item--collapsed': collapsed,
        })}
        key={label}
      >
        <a
          className={classnames('menu__link', {
            'menu__link--sublist': collapsible,
            'menu__link--active': collapsible && !item.collapsed,
          })}
          href="#!"
          onClick={collapsible ? handleItemClick : undefined}
        >
          {label}
        </a>
        <ul className="menu__list">
          {items.map((childItem) => {
            const active = childItem.href === location.hash;

            return (
              <li
                className={classnames('menu__list-item', {
                  'nick-is-active': active,
                  'nick-is-deprecated': childItem.deprecated,
                })}
                key={childItem.href}
              >
                <a
                  className="menu__link"
                  style={{
                    justifyContent: 'left',
                  }}
                  href={childItem.href}
                  onClick={onItemClick}
                >
                  {/* <span>{childItem.label}</span> */}
                  {childItem.deprecated && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      style={{
                        alignSelf: 'center',
                        flexShrink: 0,
                        marginRight:
                          'calc(var(--ifm-menu-link-padding-horizontal) / 1.5)',
                      }}
                      fill="currentColor"
                      width="18px"
                      height="18px"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z" />
                    </svg>
                  )}
                  <span>{childItem.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </li>
    )
  );
}

function DocSidebar({ activePage, sidebar, location, sidebarCollapsible }) {
  const [showResponsiveSidebar, setShowResponsiveSidebar] = useState(false);

  if (sidebarCollapsible) {
    // collapse all
    sidebar.forEach((item) => {
      item.collapsed = true;
    });
    // open active page
    sidebar[activePage].collapsed = false;
  }

  return (
    <div className={styles.sidebar}>
      <div
        className={classnames('menu', 'menu--responsive', {
          'menu--show': showResponsiveSidebar,
        })}
      >
        <button
          aria-label={showResponsiveSidebar ? 'Close Menu' : 'Open Menu'}
          className="button button--secondary button--sm menu__button"
          type="button"
          onClick={() => {
            setShowResponsiveSidebar(!showResponsiveSidebar);
          }}
        >
          {showResponsiveSidebar ? (
            <span
              className={classnames(
                styles.sidebarMenuIcon,
                styles.sidebarMenuCloseIcon
              )}
            >
              &times;
            </span>
          ) : (
            <svg
              className={styles.sidebarMenuIcon}
              xmlns="http://www.w3.org/2000/svg"
              height={MOBILE_TOGGLE_SIZE}
              width={MOBILE_TOGGLE_SIZE}
              viewBox="0 0 32 32"
              role="img"
              focusable="false"
            >
              <title>Menu</title>
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="2"
                d="M4 7h22M4 15h22M4 23h22"
              />
            </svg>
          )}
        </button>

        <ul className="menu__list">
          {sidebar.map((item, i) => (
            <DocSidebarItem
              key={item.label}
              item={item}
              onItemClick={() => {
                setShowResponsiveSidebar(false);
              }}
              collapsible={sidebarCollapsible}
              active={i === activePage}
              location={location}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DocSidebar;
