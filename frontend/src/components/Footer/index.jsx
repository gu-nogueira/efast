import React, { useState } from 'react';

import { Container } from './styles';
import Logo from '../../assets/svgs/logo-white.svg';

function Footer() {
  return (
    <Container>
      <img src={Logo} alt="Logo" />
      <small>
        Feito com 🤍 por{' '}
        <a
          href="http://github.com/gu-nogueira"
          target="_blank"
          rel="noopener noreferrer"
        >
          Gustavo Nogueira
        </a>
      </small>
    </Container>
  );
}

export default Footer;
