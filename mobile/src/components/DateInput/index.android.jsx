import React, { useMemo } from 'react';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { Container, DateButton, DateText } from './styles';

const DateInput = ({ date, onChange }) => {
  const dateFormatted = useMemo(() => {
    return date && format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  }, [date]);

  function handleOpenPicker() {
    DateTimePickerAndroid.open({
      mode: 'date',
      display: 'spinner',
      value: date,
      onChange: (event, selectedDate) => {
        if (event.type !== 'dismissed') {
          onChange(selectedDate);
        }
      },
      is24Hour: true,
    });
  }

  return (
    <Container>
      <DateButton onPress={handleOpenPicker}>
        <Icon name="event" color="#fff" size={20} />
        <DateText>{dateFormatted}</DateText>
      </DateButton>
    </Container>
  );
};

export default DateInput;
