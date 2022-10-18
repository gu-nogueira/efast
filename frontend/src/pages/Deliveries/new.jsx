import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Form } from '@unform/web';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import api from '../../services/api';
import history from '../../services/history';
import DeliveriesForms from './forms';

import { Row, Wrapper } from './styles';
import { MdArrowBack, MdOutlineDone } from 'react-icons/md';
import { ReactComponent as Loader } from '../../assets/svgs/loader.svg';

/*
 *  Yup schema structure
 */

const schema = Yup.object().shape({
  product: Yup.string().required('Informe o nome do produto'),
  recipient: Yup.string().required('Selecione um destinatário'),
  deliveryman: Yup.string().required('Selecione um entregador'),
});

function DeliveriesNew() {
  const [loading, setLoading] = useState(false);

  const formRef = useRef();

  async function handleSubmit({ product, recipient, deliveryman }) {
    try {
      /*
       *  Remove all previous errors
       */
      formRef.current.setErrors({});

      /*
       *  Yup validation
       */

      await schema.validate(
        { product, recipient, deliveryman },
        { abortEarly: false }
      );

      setLoading(true);

      await api.post('/deliveries', {
        product,
        recipient_id: recipient,
        deliveryman_id: deliveryman,
      });

      setLoading(false);

      toast.success('Encomenda criada com sucesso!');
      history.push('/deliveries');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = {};

        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });

        return formRef.current.setErrors(validationErrors);
      }

      setLoading(false);

      toast.error('Não foi possível cadastrar a encomenda');
    }
  }

  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <Row mb={30}>
        <h2>Cadastro de encomendas</h2>
        <Wrapper flex>
          <Link to="/deliveries" className="button grey">
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
        <DeliveriesForms />
      </div>
    </Form>
  );
}

export default DeliveriesNew;
