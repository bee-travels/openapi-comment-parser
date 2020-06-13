import React from 'react';

import styles from './styles.module.css';

function FormTextInput({ placeholder, value, onChange, password }) {
  return (
    <input
      className={styles.input}
      type={password ? 'password' : 'text'}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

export default FormTextInput;
