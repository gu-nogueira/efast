import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Form } from '@unform/web';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import api from '../../services/api';
import history from '../../services/history';
import DeliverymenForms from './forms';

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
  email: Yup.string().required('Email obrigatório'),
  password: Yup.string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .required('Senha obrigatória'),
  confirmPassword: Yup.string().when('password', (password, field) =>
    password
      ? field
          .required('Confirme sua senha')
          .oneOf([Yup.ref('password')], 'A senha não confere')
      : field
  ),
});

function DeliverymenNew() {
  const [loading, setLoading] = useState(false);

  const formRef = useRef();

  async function handleSubmit({
    name,
    email,
    password,
    confirmPassword,
    avatar,
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
        { name, email, password, confirmPassword },
        { abortEarly: false }
      );

      setLoading(true);

      if (avatar) {
        const upload = new FormData();
        upload.append('file', avatar);
        const response = await api.post('files', upload);
        const { id } = response.data;
        avatar = id;
      }

      await api.post('/users', {
        name,
        email,
        password,
        role: 'deliveryman',
        avatar_id: avatar,
      });

      setLoading(false);

      toast.success('Entregador cadastrado com sucesso!');
      history.push('/deliverymen');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = {};

        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });

        return formRef.current.setErrors(validationErrors);
      }

      setLoading(false);

      toast.error('Não foi possível cadastrar o entregador');
    }
  }

  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <Row mb={30}>
        <h2>Cadastro de entregador</h2>
        <Wrapper flex>
          <Link to="/deliverymen" className="button grey">
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
        <DeliverymenForms />
      </div>
    </Form>
  );
}

export default DeliverymenNew;
