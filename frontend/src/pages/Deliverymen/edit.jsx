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
  oldPassword: Yup.string(),
  password: Yup.string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .when('oldPassword', (oldPassword, field) =>
      oldPassword ? field.required('Senha obrigatória') : field
    ),
  confirmPassword: Yup.string().when('password', (password, field) =>
    password
      ? field
          .required('Confirme sua senha')
          .oneOf([Yup.ref('password')], 'A senha não confere')
      : field
  ),
});

function DeliverymenEdit({ location }) {
  const [deliveryman] = useState(location?.state);
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');

  const formRef = useRef();

  function handleSetInitialData() {
    const initialData = {
      name: deliveryman.name,
      email: deliveryman.email,
      avatar: deliveryman.avatar && deliveryman.avatar.url,
      oldPassword: null,
      password: null,
      confirmPassword: null,
    };
    formRef.current.setData(initialData);
  }

  async function handleSubmit({
    name,
    email,
    oldPassword,
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
        { name, email, oldPassword, password, confirmPassword },
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

      await api.put(`/users/${deliveryman.id}`, {
        name,
        email,
        oldPassword: oldPassword || undefined,
        password,
        confirmPassword,
        avatar_id: avatar,
      });

      setLoading(false);

      toast.success('Entregador editado com sucesso!');
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

      toast.error('Não foi possível editar o entregador');
    }
  }

  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <Row mb={30}>
        <h2>{deliveryman.name}</h2>
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
        <DeliverymenForms
          userName={deliveryman.name}
          setInitialData={handleSetInitialData}
          oldPassword={oldPassword}
          setOldPassword={setOldPassword}
        />
      </div>
    </Form>
  );
}

export default DeliverymenEdit;
