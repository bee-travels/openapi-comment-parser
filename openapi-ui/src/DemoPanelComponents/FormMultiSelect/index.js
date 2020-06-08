import React from 'react';

import styles from './styles.module.css';

function FormMultiSelect({ label, type, options, value, onChange }) {
  if (options.length === 0) {
    return null;
  }

  let height;
  if (options.length < 6) {
    const selectPadding = 12 * 2;
    const rawHeight = options.length * 29;
    const innerMargins = 4 * options.length - 1;
    const outerMargins = 4 * 2;
    const mysteryScroll = 1;
    height =
      rawHeight + innerMargins + outerMargins + selectPadding + mysteryScroll;
  }

  return (
    <div className="nick-form-item">
      <code>{label}</code>
      {type && <span style={{ opacity: 0.6 }}> — {type}</span>}
      <div>
        <select
          style={{ height: height }}
          className={styles.selectInput}
          value={value}
          onChange={onChange}
          size={Math.min(6, options.length + 1)}
          multiple
        >
          {options.map((option) => {
            return <option value={option}>{option}</option>;
          })}
        </select>
      </div>
    </div>
  );
}

export default FormMultiSelect;
