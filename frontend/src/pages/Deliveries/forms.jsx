import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import api from '../../services/api';

import Input from '../../components/Input';
import Select from '../../components/Select';

import { Row, Wrapper } from './styles';

function DeliveriesForms({ setInitialData }) {
  const [recipients, setRecipients] = useState([]);
  const [deliverymen, setDeliverymen] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchFormData() {
    try {
      setLoading(true);
      const searches = [
        api.get('/recipients'),
        api.get('/users', { params: { roles: ['deliveryman'] } }),
      ];
      const [recipientsResponse, deliverymenResponse] = await Promise.all(
        searches
      );
      setRecipients(
        recipientsResponse.data.rows.map((recipient) => ({
          value: recipient.id,
          label: recipient.destiny_name,
          ...recipient,
        }))
      );
      setDeliverymen(
        deliverymenResponse.data.rows.map((deliveryman) => ({
          value: deliveryman.id,
          label: deliveryman.name,
          ...deliveryman,
        }))
      );
    } catch (err) {
      // Improve this error handling
      toast.error('Não foi possível carregar os dados');
    }

    setLoading(false);
  }

  /*
   * Fills with initial data if it's an edit
   */

  useEffect(() => {
    (async () => {
      await fetchFormData();
      if (setInitialData && typeof setInitialData === 'function') {
        setInitialData();
      }
    })();
  }, [setInitialData]);

  return (
    <>
      <Row>
        <Wrapper stretch>
          <label htmlFor="recipient">Destinatário</label>
          <Select
            name="recipient"
            options={recipients}
            placeholder={
              !loading ? 'Selecione um destinatário' : 'Carregando...'
            }
          />
        </Wrapper>
        <Wrapper stretch>
          <label htmlFor="deliveryman">Entregador</label>
          <Select
            name="deliveryman"
            options={deliverymen}
            placeholder={!loading ? 'Selecione um entregador' : 'Carregando...'}
          />
        </Wrapper>
      </Row>
      <Row>
        <Wrapper stretch>
          <label htmlFor="product">Nome do produto</label>
          <Input name="product" id="product" />
        </Wrapper>
      </Row>
    </>
  );
}

export default DeliveriesForms;
