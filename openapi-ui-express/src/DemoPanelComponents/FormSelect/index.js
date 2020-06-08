import React from 'react';

import styles from './styles.module.css';

function FormSelect({ label, options, value, onChange }) {
  if (options.length === 0) {
    return null;
  }

  return (
    <div className="nick-form-item">
      <code>{label}</code>
      <div>
        <select
          className={styles.selectInput}
          value={value}
          onChange={onChange}
        >
          {options.map((option) => {
            return <option value={option}>{option}</option>;
          })}
        </select>
      </div>
    </div>
  );
}

export default FormSelect;
