import React, { useRef } from 'react';
import ReactSelect, { components } from 'react-select';

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
  const multiSelectRef = useRef(null);
  return (
    <ReactSelect
      isMulti={multi}
      closeMenuOnSelect={!multi}
      hideSelectedOptions={!multi}
      // components={{
      //   Option,
      // }}
      allowSelectAll={multi}
      ref={multiSelectRef}
      styles={styles}
      className="react-select-container"
      classNamePrefix="react-select"
      {...rest}
    />
  );
}

export default MultiSelect;
