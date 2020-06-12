import React from 'react';

import styles from './styles.module.css';

function ParamTextFormItem({ label, type, placeholder, value, onChange }) {
  return (
    <div className="nick-form-item">
      <code>{label}</code>
      {type && <span style={{ opacity: 0.6 }}> — {type}</span>}
      <div>
        <input
          className={styles.input}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default ParamTextFormItem;
