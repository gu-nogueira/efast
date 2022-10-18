import React, { useRef, useEffect } from 'react';
import ReactSelect from 'react-select';
import { useField } from '@unform/core';

import { styles } from './styles';

function Select({ name, ...rest }) {
  const selectRef = useRef(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);

  /*
   *  Unform registerField
   */

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      getValue: (ref) => {
        if (rest.isMulti) {
          const selectedOptions = ref.getValue();
          if (!selectedOptions) {
            return [];
          }
          return selectedOptions.map((option) => option.value);
        }
        const [selectedOption] = ref.getValue();
        if (!selectedOption) {
          return '';
        }
        return selectedOption.value;
      },
      setValue: (ref, value) => {
        ref.setValue(value || null);
      },
      clearValue: (ref) => {
        ref.clearValue();
      },
    });
  }, [fieldName, registerField, rest.isMulti]);

  return (
    <>
      <ReactSelect
        name={name}
        ref={selectRef}
        defaultValue={defaultValue}
        styles={styles}
        hasError={error ? true : false}
        className="react-select-container"
        classNamePrefix="react-select"
        {...rest}
      />
      {error && <span className="error">{error}</span>}
    </>
  );
}

export default Select;
