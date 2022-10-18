import React from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
// import { showMessage } from 'react-native-flash-message';

import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '~/services/api';

import errorParser from '~/utils/errorParser';

import { Container, Left, Label, Center, Right } from './styles';

export default function ActionsCard({ delivery }) {
  const profile = useSelector((state) => state.user.profile);
  const navigation = useNavigation();

  const handleAddProblem = async () => {
    if (delivery.end_date) return;

    navigation.navigate('SendProblem', { id: delivery.id });
  };

  const handleConfirm = async () => {
    if (delivery.end_date) return;

    if (delivery.start_date) {
      navigation.navigate('Confirm', { id: delivery.id });
      return;
    }

    try {
      await api.post(
        `/deliverymen/${profile.id}/deliveries/${delivery.id}`,
        null,
        {
          params: {
            start_date: new Date().toISOString(),
          },
        },
      );

      // showMessage({
      //   message: 'Encomenda retirada com sucesso',
      //   description: 'Entre em contato se tiver algum problema',
      //   type: 'info',
      // });
      Alert.alert(
        'Encomenda retirada com sucesso',
        'Entre em contato se tiver algum problema',
      );

      navigation.navigate('Dashboard');
    } catch (err) {
      // showMessage({
      //   message: 'Falha ao retirar mercadoria',
      //   description: err.response
      //     ? err.response.data.error
      //     : 'Erro de conexão com o servidor',
      //   type: 'danger',
      // });
      Alert.alert(
        'Falha ao retirar mercadoria',
        err.response?.data?.error
          ? errorParser(err.response.data.error)
          : 'Erro de conexão com o servidor',
      );
    }
  };
  return (
    <Container>
      <Left onPress={handleAddProblem}>
        <Icon name="highlight-off" color="#E74040" size={22} />
        <Label>Informar Problema</Label>
      </Left>
      <Center
        onPress={() => navigation.navigate('Problems', { id: delivery.id })}>
        <Icon name="info-outline" color="#E7BA40" size={22} />
        <Label>Visualizar Problemas</Label>
      </Center>
      <Right onPress={handleConfirm}>
        <Icon name="check-circle-outline" color="#7D40E7" size={22} />
        <Label>
          {delivery?.end_date
            ? 'Produto Entregue'
            : delivery?.start_date
            ? 'Confirmar Entrega'
            : 'Confirmar Retirada'}
        </Label>
      </Right>
    </Container>
  );
}
