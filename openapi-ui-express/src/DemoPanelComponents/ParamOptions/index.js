import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import { useActions } from 'redux/actions';
import FormMultiSelect from 'DemoPanelComponents/FormMultiSelect';
import FormTextInput from 'DemoPanelComponents/FormTextInput';

import styles from './styles.module.css';
import FormSelect from 'DemoPanelComponents/FormSelect';
import FormItem from 'DemoPanelComponents/FormItem';

function ParamOption({ param }) {
  if (param.schema.enum) {
    return <ParamSelectFormItem param={param} />;
  }

  if (param.schema.type === 'boolean') {
    return <ParamBooleanFormItem param={param} />;
  }

  if (param.schema.format === 'password') {
    return <ParamPasswordFormItem param={param} />;
  }

  // integer, number, string, int32, int64, float, double, object, byte, binary,
  // date-time, date
  return <ParamTextFormItem param={param} />;
}

function ParamOptionArrayOrPrimitive({ param }) {
  if (param.schema.type === 'array' && param.schema.items.enum) {
    return <ParamMultiSelectFormItem param={param} />;
  }

  if (param.schema.type === 'array') {
    return <ParamArrayFormItem param={param} />;
  }

  return <ParamOption param={param} />;
}

function ParamOptionWrapper({ param }) {
  return (
    <FormItem label={param.name} type={param.type}>
      <ParamOptionArrayOrPrimitive param={param} />
    </FormItem>
  );
}

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
      {/* Required Parameters */}
      {requiredParams.map((param) => (
        <ParamOptionWrapper param={param} />
      ))}

      {/* Optional Parameters */}
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
            </span>
            {showOptional
              ? 'Hide optional parameters'
              : 'Show optional parameters'}
          </button>
          {showOptional && (
            <div>
              {optionalParams.map((param) => (
                <ParamOptionWrapper param={param} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

function ParamArrayFormItem({ param }) {
  const [items, setItems] = useState([]);
  const { updateParam } = useActions();

  function handleAddItem() {
    setItems((i) => [
      ...i,
      {
        id: uuidv4(),
      },
    ]);
  }

  function handleDeleteItem(itemToDelete) {
    return () => {
      const newItems = items.filter((i) => i.id !== itemToDelete.id);
      setItems(newItems);
    };
  }

  return (
    <>
      {items.map((item) => (
        <div key={item.id} style={{ display: 'flex' }}>
          <FormTextInput
            placeholder={param.description || param.name}
            onChange={() => {}}
          />
          <button
            className={styles.buttonDelete}
            onClick={handleDeleteItem(item)}
          >
            <svg
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              width="16"
              height="16"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <path d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z"></path>
              <title>Close</title>
            </svg>
          </button>
        </div>
      ))}
      <button className={styles.buttonThin} onClick={handleAddItem}>
        Add item
      </button>
    </>
  );
}

function ParamSelectFormItem({ param }) {
  const { updateParam } = useActions();
  return (
    <FormSelect
      label={param.name}
      type={param.type}
      options={param.schema.enum}
      onChange={(e) => {}}
    />
  );
}

function ParamBooleanFormItem({ param }) {
  const { updateParam } = useActions();
  return (
    <FormSelect
      label={param.name}
      type={param.type}
      options={['true', 'false']}
      onChange={(e) => {}}
    />
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

function ParamPasswordFormItem({ param }) {
  const { updateParam } = useActions();
  return (
    <FormTextInput
      label={param.name}
      type={param.type}
      placeholder={param.description || param.name}
      value={param.value}
      onChange={(e) => updateParam({ ...param, value: e.target.value })}
      password
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
