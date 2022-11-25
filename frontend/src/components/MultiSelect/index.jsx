import React, { useRef, useEffect } from 'react';
import ReactSelect, { components } from 'react-select';
import { useField } from '@unform/core';

import { styles } from './styles';

function Option(props) {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{' '}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
}

function MultiSelect({ multi, ...rest }) {
  const selectRef = useRef(null);
  /*
   *  Unform registerField
   */

  return (
    <>
      <ReactSelect
        isMulti={multi}
        closeMenuOnSelect={!multi}
        hideSelectedOptions={!multi}
        components={{
          Option,
        }}
        allowSelectAll={multi}
        ref={selectRef}
        styles={styles}
        // hasError={error ? true : false}
        className="react-select-container"
        classNamePrefix="react-select"
        {...rest}
      />
      {/* {error && <span className="error">{error}</span>} */}
    </>
  );
}

export default MultiSelect;
