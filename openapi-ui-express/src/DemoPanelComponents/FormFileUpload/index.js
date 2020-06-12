import React, { useState } from 'react';

import MagicDropzone from 'react-magic-dropzone';

import styles from './styles.module.css';

function RenderPreview({ file }) {
  switch (file.type) {
    case 'image/png':
    case 'image/jpeg':
    case 'image/jpg':
    case 'image/svg+xml':
      return (
        <img
          style={{
            borderRadius: '4px',
          }}
          src={file.preview}
          alt=""
        />
      );
    default:
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            minWidth: 0,
          }}
        >
          <svg viewBox="0 0 100 120" style={{ width: '50px', height: '60px' }}>
            <path
              fill-rule="evenodd"
              fill="#b3beca"
              d="M100.000,39.790 L100.000,105.000 C100.000,113.284 93.284,120.000 85.000,120.000 L15.000,120.000 C6.716,120.000 -0.000,113.284 -0.000,105.000 L-0.000,15.000 C-0.000,6.716 6.716,-0.000 15.000,-0.000 L60.210,-0.000 L100.000,39.790 Z"
            />
            <path
              fill-rule="evenodd"
              fill="#90a1b1"
              transform="translate(60, 0)"
              d="M0.210,-0.000 L40.000,39.790 L40.000,40.000 L15.000,40.000 C6.716,40.000 0.000,33.284 0.000,25.000 L0.000,-0.000 L0.210,-0.000 Z"
            />
          </svg>
          <div className={styles.filename}>{file.name}</div>
        </div>
      );
  }
}

function FormSelect({ label, placeholder, onChange }) {
  const [hover, setHover] = useState(false);
  const [file, setFile] = useState(undefined);

  function handleDrop(accepted, _) {
    const [file] = accepted;
    setFile(file);
    setHover(false);
  }

  return (
    <div className="nick-form-item">
      <code>{label}</code>
      <div>
        <MagicDropzone
          className={hover ? styles.dropzoneHover : styles.dropzone}
          onDrop={handleDrop}
          onDragEnter={() => setHover(true)}
          onDragLeave={() => setHover(false)}
          multiple={false}
        >
          {file ? (
            <RenderPreview file={file} />
          ) : (
            <div className={styles.dropzoneContent}>{placeholder}</div>
          )}
        </MagicDropzone>
      </div>
    </div>
  );
}

export default FormSelect;
