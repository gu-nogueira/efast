import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import api from '../../services/api';

import Input from '../../components/Input';
import Select from '../../components/Select';

import { Row, Wrapper } from './styles';

function RecipientsForms({ setInitialData }) {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchStates() {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
      );
      setStates(
        response.data.map((state) => ({
          value: state.sigla,
          label: state.nome,
        }))
      );
    } catch (err) {
      // TO DO: Build backup api route in backend
      toast.error('Não foi possível carregar os estados');
    }
    setLoading(false);
  }

  async function fetchCities(state) {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`
      );
      setCities(
        response.data.map((city) => ({ value: city.nome, label: city.nome }))
      );
    } catch (err) {
      // TO DO: Build backup api route in backend
      toast.error('Não foi possível carregar as cidades');
    }
    setLoading(false);
  }

  /*
   *  Get all states on component mount
   */

  useEffect(() => {
    (async () => {
      await fetchStates();
      if (setInitialData && typeof setInitialData === 'function') {
        setInitialData();
      }
    })();
  }, [setInitialData]);

  /*
   * Get cities when selectedState & fills with initial data if it's an edit
   */

  useEffect(() => {
    fetchCities(selectedState);
  }, [selectedState]);

  return (
    <>
      <Row>
        <Wrapper stretch>
          <label htmlFor="name">Nome</label>
          <Input name="name" id="name" placeholder="Nome e sobrenome" />
        </Wrapper>
      </Row>
      <Row>
        <Wrapper width={60}>
          <label htmlFor="address">Endereço</label>
          <Input name="address" id="address" placeholder="R. Fulano de Tal" />
        </Wrapper>
        <Wrapper width={20}>
          <label htmlFor="number">Número</label>
          <Input name="number" id="number" placeholder="123" />
        </Wrapper>
        <Wrapper width={20}>
          <label htmlFor="complement">Complemento</label>
          <Input
            name="complement"
            id="complement"
            type="complement"
            placeholder="Apto. 101"
          />
        </Wrapper>
      </Row>
      <Row>
        <Wrapper stretch>
          <label htmlFor="state">Estado</label>
          <Select
            name="state"
            options={states}
            placeholder={!loading ? 'Selecione um estado' : 'Carregando...'}
            onChange={(e) => setSelectedState(e.value)}
          />
        </Wrapper>
        <Wrapper stretch>
          <label htmlFor="city">Cidade</label>
          <Select
            name="city"
            options={cities}
            placeholder={
              !loading
                ? !selectedState
                  ? 'Primeiro, selecione um estado'
                  : 'Selecione uma cidade'
                : 'Carregando...'
            }
            isDisabled={!selectedState}
          />
        </Wrapper>
        <Wrapper stretch>
          <label htmlFor="cep">CEP</label>
          <Input name="cep" id="cep" type="cep" placeholder="12345-789" />
        </Wrapper>
      </Row>
    </>
  );
}

export default RecipientsForms;
