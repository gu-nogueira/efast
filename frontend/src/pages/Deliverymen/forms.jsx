import React, { useEffect } from 'react';

import Input from '../../components/Input';
import File from '../../components/File';

import { Row, Wrapper } from './styles';

function DeliverymenForms({ setInitialData, userName }) {
  /*
   * Fills with initial data if it's an edit
   */

  useEffect(() => {
    if (setInitialData && typeof setInitialData === 'function') {
      setInitialData();
    }
  }, [setInitialData]);

  return (
    <>
      <Row>
        <File userName={userName} name="avatar" />
      </Row>
      <Row>
        <Wrapper stretch>
          <label htmlFor="name">Nome</label>
          <Input name="name" id="name" placeholder="Nome e sobrenome" />
        </Wrapper>
        <Wrapper stretch>
          <label htmlFor="email">Email</label>
          <Input
            name="email"
            id="email"
            type="email"
            placeholder="exemplo@efast.com.br"
          />
        </Wrapper>
      </Row>
    </>
  );
}

export default DeliverymenForms;
