import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { signUpRequest } from '../../store/modules/auth/actions';

import Input from '../../components/Input';

import { Column } from './styles';
import Logo from '../../assets/svgs/logo-white.svg';
import { ReactComponent as Loader } from '../../assets/svgs/loader.svg';
import {
  MdOutlineSubdirectoryArrowLeft,
  MdPerson,
  MdEmail,
  MdLock,
} from 'react-icons/md';

/*
 *  Yup schema structure
 */

const schema = Yup.object().shape({
  name: Yup.string().required('Nome obrigatório'),
  email: Yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  password: Yup.string()
    .min(6, 'Mínimo 6 caracteres')
    .required('Senha obrigatória'),
  confirmPassword: Yup.string().when('password', (password, field) =>
    password
      ? field
          .oneOf([Yup.ref('password')], 'Senha não confere')
          .required('Confirme a senha')
      : field
  ),
});

function Register() {
  const formRef = useRef();
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.auth.loading);
  const profile = useSelector((state) => state.user.profile);

  async function handleSubmit({ name, email, confirmPassword, password }) {
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

      dispatch(signUpRequest(name, email, password));
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = {};

        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });

        formRef.current.setErrors(validationErrors);
      }
    }
  }

  return (
    <>
      <Column>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h2>Crie sua conta</h2>
          <Input
            icon={MdPerson}
            name="name"
            type="text"
            placeholder="Seu nome"
          />
          <Input
            icon={MdEmail}
            name="email"
            type="email"
            placeholder="Seu e-mail"
          />
          <Input
            icon={MdLock}
            name="password"
            type="password"
            placeholder="Sua senha"
          />
          <Input
            icon={MdLock}
            name="confirmPassword"
            type="password"
            placeholder="Confirmar senha"
          />
          <button type="submit">
            {loading ? (
              <>
                <Loader />
                {'Carregando'}
              </>
            ) : (
              'Cadastrar'
            )}
          </button>
          <div className="back">
            <Link to="/login">
              <MdOutlineSubdirectoryArrowLeft />
              Voltar para tela de login
            </Link>
          </div>
        </Form>
      </Column>
      <Column>
        <img src={Logo} alt="Efast" />
      </Column>
    </>
  );
}

export default Register;
