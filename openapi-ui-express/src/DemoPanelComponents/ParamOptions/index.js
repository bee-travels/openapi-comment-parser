import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import { useActions } from 'redux/actions';
import FormMultiSelect from 'DemoPanelComponents/FormMultiSelect';
import FormTextInput from 'DemoPanelComponents/FormTextInput';

import styles from './styles.module.css';

function ParamOptions() {
  const [showOptional, setShowOptional] = useState(false);

  const pathParams = useSelector((state) => state.params.path);
  const queryParams = useSelector((state) => state.params.query);
  const cookieParams = useSelector((state) => state.params.cookie);
  const headerParams = useSelector((state) => state.params.header);

  const allParams = [
    ...pathParams,
    ...queryParams,
    ...cookieParams,
    ...headerParams,
  ];

  const requiredParams = allParams.filter((p) => p.required);
  const optionalParams = allParams.filter((p) => !p.required);

  return (
    <>
      {requiredParams.map((param) => {
        if (param.schema.type === 'array' && param.schema.items.enum) {
          return <ParamMultiSelectFormItem param={param} />;
        }
        return <ParamTextFormItem param={param} />;
      })}
      {optionalParams.length > 0 && (
        <>
          <button
            className={styles.showMoreButton}
            onClick={() => setShowOptional((prev) => !prev)}
          >
            <span
              style={{
                width: '1.5em',
                display: 'inline-block',
                textAlign: 'center',
              }}
            >
              <span
                className={showOptional ? styles.plusExpanded : styles.plus}
              >
                <div>
                  <svg
                    style={{
                      fill: 'currentColor',
                      width: '10px',
                      height: '10px',
                    }}
                    height="16"
                    viewBox="0 0 16 16"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 7h6a1 1 0 0 1 0 2H9v6a1 1 0 0 1-2 0V9H1a1 1 0 1 1 0-2h6V1a1 1 0 1 1 2 0z"
                      fill-rule="evenodd"
                    ></path>
                  </svg>
                </div>
              </span>
              {/* {showOptional ? '-' : '+'} */}
            </span>
            {showOptional
              ? 'Hide optional parameters'
              : 'Show optional parameters'}
          </button>
          {showOptional && (
            <div>
              {optionalParams.map((param) => {
                return <ParamTextFormItem param={param} />;
              })}
            </div>
          )}
        </>
      )}
    </>
  );
}

function ParamMultiSelectFormItem({ param }) {
  const { updateParam } = useActions();
  return (
    <FormMultiSelect
      label={param.name}
      type={param.type}
      options={param.schema.items.enum}
      onChange={(e) => {
        const values = Array.prototype.filter
          .call(e.target.options, (o) => o.selected)
          .map((o) => o.value);

        updateParam({
          ...param,
          value: values.length > 0 ? values : undefined,
        });
      }}
    />
  );
}

function ParamTextFormItem({ param }) {
  const { updateParam } = useActions();
  return (
    <FormTextInput
      label={param.name}
      type={param.type}
      placeholder={param.description || param.name}
      value={param.value}
      onChange={(e) => updateParam({ ...param, value: e.target.value })}
    />
  );
}

export default ParamOptions;
