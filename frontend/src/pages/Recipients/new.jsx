import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Form } from '@unform/web';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import api from '../../services/api';
import history from '../../services/history';
import RecipientsForms from './forms';

import { Row, Wrapper } from './styles';
import { MdArrowBack, MdOutlineDone } from 'react-icons/md';
import { ReactComponent as Loader } from '../../assets/svgs/loader.svg';

/*
 *  Yup schema structure
 */

const schema = Yup.object().shape({
  name: Yup.string()
    .test('complete-name', 'Insira um nome e sobrenome', (name) => {
      const [firstName, lastName] = name.split(' ');
      return !!(firstName && lastName);
    })
    .required('Nome obrigatório'),
  address: Yup.string().required('Endereço obrigatório'),
  number: Yup.string().required('Número obrigatório'),
  complement: Yup.string(),
  state: Yup.string()
    .required('Estado obrigatório')
    .uppercase()
    .max(2, 'Estado deve conter 2 dígitos'),
  city: Yup.string().required('Cidade obrigatória'),
  cep: Yup.string()
    .required('CEP obrigatório')
    .max(9, 'CEP deve conter no máximo 9 dígitos'),
});

function RecipientsNew() {
  const [loading, setLoading] = useState(false);

  const formRef = useRef();

  async function handleSubmit({
    name,
    address,
    number,
    complement,
    state,
    city,
    cep,
  }) {
    try {
      /*
       *  Remove all previous errors
       */
      formRef.current.setErrors({});

      /*
       *  Yup validation
       */

      await schema.validate(
        { name, address, number, complement, state, city, cep },
        { abortEarly: false }
      );

      setLoading(true);

      await api.post('/recipients', {
        destiny_name: name,
        address,
        number: Number(number),
        complement,
        state,
        city,
        cep,
      });

      setLoading(false);

      toast.success('Destinatário cadastrado com sucesso!');
      history.push('/recipients');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = {};

        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });

        return formRef.current.setErrors(validationErrors);
      }

      setLoading(false);

      toast.error('Não foi possível cadastrar o destinatário');
    }
  }

  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <Row mb={30}>
        <h2>Cadastro de encomendas</h2>
        <Wrapper flex>
          <Link to="/recipients" className="button grey">
            <MdArrowBack size={20} />
            <span>Voltar</span>
          </Link>
          <button type="submit" className="button">
            {loading ? (
              <>
                <Loader />
                <span>Carregando</span>
              </>
            ) : (
              <>
                <MdOutlineDone size={20} />
                <span>Salvar</span>
              </>
            )}
          </button>
        </Wrapper>
      </Row>
      <div className="card">
        <RecipientsForms />
      </div>
    </Form>
  );
}

export default RecipientsNew;
