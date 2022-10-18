import React, { useRef, useState, useEffect } from 'react';
import { useField } from '@unform/core';

import { Container } from './styles';
import { HiEye, HiEyeOff } from 'react-icons/hi';

function Input({ icon: Icon, name, type, mask, ...rest }) {
  const [focused, setFocused] = useState();
  const [visible, setVisible] = useState(false);

  const inputRef = useRef();
  const { fieldName, defaultValue, registerField, error } = useField(name);

  /*
   *  Unform registerField
   */

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: (ref) => {
        return ref.current.value;
      },
      setValue: (ref, value) => {
        ref.current.value = value;
      },
      clearValue: (ref) => {
        ref.current.value = '';
      },
    });
  }, [fieldName, registerField]);

  function handleFocus() {
    setFocused(!focused);
  }

  function handleBlur() {
    setFocused(false);
  }

  function handleVisible() {
    setVisible(!visible);
    inputRef.current.focus();
  }

  return (
    <>
      <Container
        focused={focused}
        hasError={error ? true : false}
        className="input"
      >
        {Icon && <Icon size={18} />}
        <input
          name={name}
          ref={inputRef}
          defaultValue={defaultValue}
          type={type === 'password' ? (visible ? 'text' : 'password') : type}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        {type === 'password' && (
          <button type="button" onClick={handleVisible}>
            {visible ? <HiEyeOff size={18} /> : <HiEye size={18} />}
          </button>
        )}
      </Container>
      {error && <span className="error">{error}</span>}
    </>
  );
}

export default Input;
