import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import Spinner from 'react-native-loading-spinner-overlay';

import api from '~/services/api';

import {
  Container,
  Background,
  Content,
  Form,
  Input,
  Button,
  Text,
} from './styles';

export default function SendProblem({ navigation, route }) {
  const { id: deliveryId } = route.params;

  const profile = useSelector((state) => state.user.profile);

  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');

  async function handleSubmit() {
    setLoading(true);

    try {
      await api.put(
        `/deliverymen/${profile.id}/deliveries/${deliveryId}/problems`,
        {
          description,
        },
      );

      navigation.goBack();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Falha no envio do problema',
        'Houve um erro no envio do problema, tente novamente mais tarde',
      );
    }
  }

  return (
    <Container>
      <Background />
      <Content>
        {/* <Spinner
          visible={loading}
          animation="fade"
          overlayColor="rgba(0,0,0,0.8)"
          textContent="Enviando problema"
          textStyle={{ color: '#fff' }}
        /> */}
        <Form>
          <Input value={description} onChangeText={setDescription} />
          <Button onPress={handleSubmit}>
            <Text>Enviar</Text>
          </Button>
        </Form>
      </Content>
    </Container>
  );
}

SendProblem.propTypes = {
  navigation: PropTypes.shape().isRequired,
};
