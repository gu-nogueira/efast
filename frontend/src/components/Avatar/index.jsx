import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import setAvatarInitials from '../../utils/setAvatarInitials';

import { Container, AvatarInitials } from './styles';

function Avatar({ imageUrl, name, size }) {
  const [initials, setInitials] = useState('');
  const [color, setColor] = useState('#FFF');

  /*
   *  Set initials and color in avatar
   */

  useMemo(() => {
    if (name) {
      const { userInitials, randomColor } = setAvatarInitials(name);
      setInitials(userInitials);
      setColor(randomColor);
    }
  }, [name]);

  return (
    <Container>
      {imageUrl ? (
        <img src={imageUrl} alt={name} />
      ) : (
        <AvatarInitials color={color}>{initials}</AvatarInitials>
      )}
    </Container>
  );
}

/*
 *  propTypes definition
 */

Avatar.propTypes = {
  imageUrl: PropTypes.string,
  name: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

/*
 *  defaultProps definition
 */

Avatar.defaultProps = {
  size: 'default',
};

export default Avatar;
