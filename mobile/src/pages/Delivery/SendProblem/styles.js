import styled from 'styled-components/native';
import colors from '~/styles/colors';

export const Container = styled.SafeAreaView`
  flex: 1;
  background: ${colors.background};
`;

export const Background = styled.View`
  background: ${colors.purple};
  height: 140px;
`;

export const Content = styled.View`
  align-items: center;
  top: -70px;
`;

export const Form = styled.View`
  width: 335px;
`;

export const Input = styled.TextInput.attrs({
  multiline: true,
  textAlignVertical: 'top',
  placeholder: 'Inclua aqui o problema que ocorreu na entrega.',
  placeholderTextColor: '#999999',
})`
  background: #fff;
  color: ${colors.black1};
  border-radius: 4px;
  padding: 20px;
  height: 300px;
  font-size: 16px;

  shadow-color: ${colors.purple + '66'};
  shadow-offset: {width: 0, height: 2};
  shadow-opacity: 0.3;
  shadow-radius: 3;
  elevation: 10;
`;

export const Button = styled.TouchableOpacity`
  background: ${colors.purple};
  height: 45px;
  border-radius: 4px;
  margin-top: 20px;
  align-items: center;
  justify-content: center;
`;

export const Text = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
