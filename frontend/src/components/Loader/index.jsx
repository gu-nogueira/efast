import React from 'react';

import { ReactComponent as Spinner } from '../../assets/svgs/loader.svg';

import { Container } from './styles';

function Loader() {
  return (
    <Container>
      <Spinner />
    </Container>
  );
}

export default Loader;
