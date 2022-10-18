import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { signInRequest } from '../../store/modules/auth/actions';

import Input from '../../components/Input';

import { Column } from './styles';
import Logo from '../../assets/svgs/logo-white.svg';
import { ReactComponent as Loader } from '../../assets/svgs/loader.svg';
import { MdEmail, MdLock } from 'react-icons/md';

/*
 *  Yup schema structure
 */

const schema = Yup.object().shape({
  email: Yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  password: Yup.string().required('Senha obrigatória'),
});

function Login() {
  const formRef = useRef();
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.auth.loading);

  async function handleSubmit({ email, password }) {
    try {
      /*
       *  Remove all previous errors
       */
      formRef.current.setErrors({});

      /*
       *  Yup validation
       */

      await schema.validate({ email, password }, { abortEarly: false });

      dispatch(signInRequest(email, password));
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
        <img src={Logo} alt="Efast" />
      </Column>
      <Column>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h2>Faça seu login</h2>
          <Input
            icon={MdEmail}
            name="email"
            type="email"
            placeholder="E-mail"
          />
          <Input
            icon={MdLock}
            name="password"
            type="password"
            placeholder="Senha"
          />
          {/* TO DO: efast v2 */}
          {/* <Link to="/forgot">Esqueci minha senha</Link> */}
          <button type="submit">
            {loading ? (
              <>
                <Loader />
                {'Carregando'}
              </>
            ) : (
              'Entrar'
            )}
          </button>
          {/* TO DO: efast v2 */}
          {/* <small>
            Não possui uma conta? <Link to="/register">Registre-se</Link>
          </small> */}
        </Form>
      </Column>
    </>
  );
}

export default Login;
