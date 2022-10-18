import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useField } from '@unform/core';

import setAvatarInitials from '../../utils/setAvatarInitials';

import { Container, AvatarInitials, DefaultInput } from './styles';
import { MdImage } from 'react-icons/md';

function FileInput({ name, userName, ...rest }) {
  const fileInputRef = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);

  const [preview, setPreview] = useState(defaultValue);
  const [initials, setInitials] = useState('');
  const [color, setColor] = useState('#FFF');

  /*
   *  Set initials and color in avatar
   */

  useMemo(() => {
    if (userName) {
      const { userInitials, randomColor } = setAvatarInitials(userName);
      setInitials(userInitials);
      setColor(randomColor);
    }
  }, [userName]);

  /*
   *  Shows image preview when added
   */

  const handlePreview = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
    } else {
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL);
    }
  }, []);

  /*
   *  Unform registerField
   */

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: fileInputRef.current,
      path: 'files[0]',
      clearValue(ref) {
        ref.value = '';
        setPreview(null);
      },
      setValue(_, value) {
        setPreview(value);
      },
    });
  }, [fieldName, registerField]);

  return (
    <Container>
      <label htmlFor="file">
        {preview ? (
          <img src={preview} alt="Preview" width="100" />
        ) : userName ? (
          <AvatarInitials color={color}>{initials}</AvatarInitials>
        ) : (
          <DefaultInput>
            <MdImage size={45} />
            <strong>Adicionar foto</strong>
          </DefaultInput>
        )}
        <input
          type="file"
          id="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handlePreview}
          {...rest}
        />
      </label>
    </Container>
  );
}

export default FileInput;
