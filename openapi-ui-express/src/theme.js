import React, { useReducer, useContext } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'dark':
      localStorage.setItem('theme', 'dark');
      document.querySelector('html').setAttribute('data-theme', 'dark');
      return { ...state, theme: 'dark' };
    case 'light':
      localStorage.setItem('theme', 'light');
      document.querySelector('html').setAttribute('data-theme', 'light');
      return { ...state, theme: 'light' };
    case 'update-language':
      localStorage.setItem('code-lang', action.language);
      return { ...state, language: action.language };
    default:
      throw new Error();
  }
}

// Prevent flicker.
export function init() {
  const theme = localStorage.getItem('theme') || 'dark';
  const language = localStorage.getItem('code-lang') || 'curl';
  document.querySelector('html').setAttribute('data-theme', theme);
  return { theme: theme, language: language };
}

const ThemeContext = React.createContext();

function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, init());
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
    language: state.language,
    setDarkMode: () => {
      dispatch({ type: 'dark' });
    },
    setLightMode: () => {
      dispatch({ type: 'light' });
    },
    setLanguage: (language) => {
      dispatch({ type: 'update-language', language: language });
    },
  };
}

export default ThemeProvider;
