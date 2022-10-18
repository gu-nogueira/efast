import React, { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { parseISO, formatRelative } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { Container, Left, Avatar, Info, Name, Time } from './styles';

import colors from '~/styles/colors';

const Appointment = ({ data, onCancel }) => {
  const formaattedDate = useMemo(() => {
    const dateParsed = formatRelative(parseISO(data.date), new Date(), {
      locale: ptBR,
      addSuffix: true,
    });
    return dateParsed.charAt(0).toLocaleUpperCase() + dateParsed.slice(1);
  }, [data.date]);

  return (
    <Container past={data.past}>
      <Left>
        <Avatar
          source={{
            uri: data.provider.avatar
              ? // ** The default 'localhost' URL is not accessible from the Android emulator
                // ? data.provider.avatar.url
                data.provider.avatar.url.replace('localhost', '10.0.2.2')
              : `https://avatars.dicebear.com/api/initials/${encodeURIComponent(
                  data.provider.name,
                )}.png`,
          }}
        />
        <Info>
          <Name>{data.provider.name}</Name>
          <Time>{formaattedDate}</Time>
        </Info>
      </Left>
      {data.cancelable && !data.canceled_at && (
        <TouchableOpacity onPress={onCancel}>
          <Icon name="event-busy" size={20} color={colors.error} />
        </TouchableOpacity>
      )}
    </Container>
  );
};

export default Appointment;
