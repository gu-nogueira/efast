import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Form } from '@unform/web';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import api from '../../services/api';
import history from '../../services/history';
import RecipientsForms from './forms';

import findStateRecord from '../../utils/findStateRecord';

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

function RecipientsEdit({ location }) {
  const [recipient] = useState(location?.state);
  const [loading, setLoading] = useState(false);

  const formRef = useRef();

  function handleSetInitialData() {
    const state = findStateRecord(recipient.state);
    const initialData = {
      name: recipient.destiny_name,
      address: recipient.address,
      number: recipient.number,
      complement: recipient.complement,
      state: {
        value: state.sigla,
        label: state.nome,
      },
      city: {
        value: recipient.city,
        label: recipient.city,
      },
      cep: recipient.cep,
    };
    formRef.current.setData(initialData);
  }

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

      await api.put(`/recipients/${recipient.id}`, {
        destiny_name: name,
        address,
        number: Number(number),
        complement,
        state,
        city,
        cep,
      });

      setLoading(false);

      toast.success('Destinatário editado com sucesso!');
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

      toast.error('Não foi possível editar o destinatário');
    }
  }

  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <Row mb={30}>
        <h2>{recipient.name}</h2>
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
        <RecipientsForms
          userName={recipient.name}
          setInitialData={handleSetInitialData}
        />
      </div>
    </Form>
  );
}

export default RecipientsEdit;
