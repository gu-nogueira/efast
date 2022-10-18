import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Alert } from 'react-native';
import { format, parseISO } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import Spinner from 'react-native-loading-spinner-overlay';

import api from '~/services/api';

import errorParser from '~/utils/errorParser';

import {
  Container,
  Background,
  Content,
  Title,
  Problem,
  Description,
  Date,
  NotRegister,
  TextNotRegister,
} from './styles';

export default function Problems({ navigation, route }) {
  const { id: deliveryId } = route.params;

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadProblems(id) {
    setLoading(true);
    try {
      const { data } = await api.get(`deliverymen/${id}/problems`);
      setProblems(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      Alert.alert(
        'Não foi possível listar problemas',
        err.response?.data?.error
          ? errorParser(err.response.data.error)
          : 'Ocorreu um erro inesperado para recuperar os problemas, tente novamente mais tarde',
      );
      navigation.goBack();
    }
  }

  useEffect(() => {
    loadProblems(deliveryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryId]);

  return (
    <Container>
      <Background />
      <Content>
        <Title>Encomenda #{String(deliveryId).padStart(2, '0')}</Title>
        {/* <Spinner
          visible={loading}
          animation="fade"
          overlayColor="rgba(0,0,0,0.8)"
          textContent="Carregando problemas"
          textStyle={{ color: '#fff' }}
        /> */}
        {problems.length < 1 && !loading && (
          <NotRegister>
            <TextNotRegister>
              Não existem problemas para serem exebidos
            </TextNotRegister>
          </NotRegister>
        )}
        {problems.map((item) => (
          <Problem key={item.id}>
            <Description>{item.description}</Description>
            <Date>{format(parseISO(item.updated_at), 'dd/MM/yyyy')}</Date>
          </Problem>
        ))}
      </Content>
    </Container>
  );
}

Problems.propTypes = {
  navigation: PropTypes.shape().isRequired,
};
