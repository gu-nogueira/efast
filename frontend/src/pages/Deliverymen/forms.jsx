import React, { useEffect } from 'react';

import Input from '../../components/Input';
import File from '../../components/File';

import { Row, Wrapper } from './styles';

function DeliverymenForms({
  setInitialData,
  userName,
  oldPassword,
  setOldPassword,
}) {
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
      <Row>
        {setInitialData && (
          <Wrapper stretch>
            <label htmlFor="oldPassword">Senha atual</label>
            <Input
              name="oldPassword"
              id="oldPassword"
              type="password"
              placeholder="Sua senha atual"
              onChange={(e) => setOldPassword && setOldPassword(e.target.value)}
              value={oldPassword}
            />
          </Wrapper>
        )}

        {(oldPassword || !setInitialData) && (
          <>
            <Wrapper stretch>
              <label htmlFor="password">Senha</label>
              <Input
                name="password"
                id="password"
                type="password"
                placeholder="Sua senha"
              />
            </Wrapper>
            <Wrapper stretch>
              <label htmlFor="confirmPassword">Confirmar senha</label>
              <Input
                name="confirmPassword"
                id="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
              />
            </Wrapper>
          </>
        )}
      </Row>
    </>
  );
}

export default DeliverymenForms;
