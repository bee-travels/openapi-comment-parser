import React, { useReducer, useContext } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'dark':
      localStorage.setItem('theme', 'dark');
      document.querySelector('html').setAttribute('data-theme', 'dark');
      return { theme: 'dark' };
    case 'light':
      localStorage.setItem('theme', 'light');
      document.querySelector('html').setAttribute('data-theme', 'light');
      return { theme: 'light' };
    default:
      throw new Error();
  }
}

// Prevent flicker.
export function init() {
  const theme = localStorage.getItem('theme') || 'dark';
  document.querySelector('html').setAttribute('data-theme', theme);
  return theme;
}

const ThemeContext = React.createContext();

function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { theme: init() });
  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const { state, dispatch } = useContext(ThemeContext);
  return {
    theme: state.theme,
    setDarkMode: () => {
      dispatch({ type: 'dark' });
    },
    setLightMode: () => {
      dispatch({ type: 'light' });
    },
  };
}

export default ThemeProvider;
