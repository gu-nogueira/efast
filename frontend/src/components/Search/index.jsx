import React, { useRef, useState, useEffect } from 'react';

import { Container } from './styles';
import { MdSearch, MdClose } from 'react-icons/md';

function Search({ name, value, onSearch, ...rest }) {
  const [focused, setFocused] = useState();
  const [search, setSearch] = useState('');

  const searchRef = useRef();

  function handleFocus() {
    setFocused(!focused);
  }

  function handleBlur() {
    setFocused(false);
  }

  function handleChange(e) {
    setSearch(e.target.value);
  }

  function handleClear() {
    setSearch('');
    searchRef.current.focus();
  }

  // ** Debouce search trigger listener

  useEffect(() => {
    const delayDebounceSearch = setTimeout(() => {
      onSearch(search);
    }, 500);
    return () => clearTimeout(delayDebounceSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <>
      <Container focused={focused}>
        <MdSearch size={20} />
        <input
          name={name}
          ref={searchRef}
          type="text"
          value={search}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        {search && (
          <button type="button" onClick={handleClear}>
            <MdClose size={18} />
          </button>
        )}
      </Container>
    </>
  );
}

export default Search;
