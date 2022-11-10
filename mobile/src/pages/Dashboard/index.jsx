import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { parseISO, format } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Background from '~/components/Background';
import Loader from '~/components/Loader';

import api from '~/services/api';

// ** Redux actions
import { signOut } from '~/store/modules/auth/actions';

import {
  Container,
  Header,
  Avatar,
  Initial,
  Image,
  ContentHeader,
  ContentHeaderText,
  Welcome,
  Name,
  Logout,
  Content,
  List,
  Heading,
  Title,
  Filters,
  Pending,
  HandedOut,
  TextFilter,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  TimeLine,
  Line,
  Ellipses,
  Ellipse,
  TextRow,
  TextLine,
  CardFooter,
  Info,
  Label,
  Text,
  Details,
  DetailText,
  NotRegister,
  TextNotRegister,
} from './styles';
import colors from '~/styles/colors';

function Dashboard({ navigation }) {
  const [packages, setPackages] = useState([]);
  const [isConcluded, setIsConcluded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const user = useSelector((state) => state.user.profile);

  const dispatch = useDispatch();

  const initials = useMemo(
    () =>
      user.name
        .split(' ')
        .map((n) => n[0])
        .join(''),
    [user.name],
  );

  async function loadPackages() {
    setLoading(true);
    const response = await api.get(`deliverymen/${user.id}/deliveries`, {
      params: {
        delivered: isConcluded,
        // isCanceled: false,
      },
    });
    setPackages(response.data);
    setLoading(false);
    setRefreshing(false);
  }

  // ** Fetch packages from API when focused

  useEffect(() => {
    const updatePackages = navigation.addListener('focus', () => {
      loadPackages();
    });
    return updatePackages;
  }, [navigation, isConcluded]);

  useEffect(() => {
    loadPackages();
  }, [isConcluded]);

  function handleLogout() {
    dispatch(signOut());
  }

  return (
    <Background background={colors.background}>
      <Container>
        <Header>
          <Avatar>
            {user.avatar ? (
              <Image
                source={{
                  uri:
                    // ** The default 'localhost' URL is not accessible from the Android emulator
                    user.avatar.replace('localhost', '10.0.2.2'),
                }}
              />
            ) : (
              <Initial>{initials}</Initial>
            )}
          </Avatar>
          <ContentHeader>
            <ContentHeaderText>
              <Welcome>Bem vindo de volta,</Welcome>
              <Name>{user.name}</Name>
            </ContentHeaderText>
            <Logout onPress={handleLogout}>
              <Icon name="exit-to-app" size={25} color="#E74040" />
            </Logout>
          </ContentHeader>
        </Header>
        <Content>
          <Heading>
            <Title>Entregas</Title>
            <Filters>
              <Pending onPress={() => setIsConcluded(false)}>
                <TextFilter active={!isConcluded}>Pendentes</TextFilter>
              </Pending>
              <HandedOut onPress={() => setIsConcluded(true)}>
                <TextFilter active={isConcluded}>Entregues</TextFilter>
              </HandedOut>
            </Filters>
          </Heading>

          {loading ? (
            <Loader />
          ) : packages.length > 0 ? (
            <List
              data={packages}
              keyExtractor={(item) => String(item.id)}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={loadPackages}
                />
              }
              renderItem={({ item }) => {
                const isWaiting = !item.start_date || !!item.start_date;
                const isWithdrawn = !!item.start_date;
                const isDelivered = !!item.end_date;

                return (
                  <Card>
                    <CardHeader>
                      <Icon name="local-shipping" size={22} color="#7D40E7" />
                      <CardTitle>
                        Encomenda #{String(item.id).padStart(2, '0')}
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <TimeLine>
                        <Ellipses>
                          <Line />
                          <Ellipse complete={isWaiting} />
                          <Ellipse complete={isWithdrawn} />
                          <Ellipse complete={isDelivered} />
                        </Ellipses>
                        <TextRow>
                          <TextLine>Aguardando Retirada</TextLine>
                          <TextLine>Retirada</TextLine>
                          <TextLine>Entregue</TextLine>
                        </TextRow>
                      </TimeLine>
                    </CardBody>
                    <CardFooter>
                      <Info>
                        <Label>Data</Label>
                        <Text>
                          {item.start_date
                            ? format(parseISO(item.start_date), 'dd/MM/yyyy')
                            : '--/--/----'}
                        </Text>
                      </Info>
                      <Info>
                        <Label>Cidade</Label>
                        <Text>{item.recipient.city}</Text>
                      </Info>
                      <Info>
                        <Details
                          onPress={() =>
                            navigation.navigate('Detail', { delivery: item })
                          }>
                          <DetailText>Ver detalhes</DetailText>
                        </Details>
                      </Info>
                    </CardFooter>
                  </Card>
                );
              }}
            />
          ) : (
            <NotRegister
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={loadPackages}
                />
              }>
              <TextNotRegister>
                Não existem dados para serem exibos
              </TextNotRegister>
            </NotRegister>
          )}
        </Content>
      </Container>
    </Background>
  );
}

Dashboard.propTypes = {
  isFocused: PropTypes.bool,
  navigation: PropTypes.object.isRequired,
};

export default Dashboard;
