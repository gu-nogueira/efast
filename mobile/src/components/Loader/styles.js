import styled from 'styled-components/native';

import colors from '~/styles/colors';

export const Container = styled.View`
  align-self: center;
  background-color: #fff;
  position: absolute;
  margin-top: 50px;
  padding: 8px;
  border-radius: 40px;
  box-shadow: 0 0 10px rgba(125, 64, 231, 0.1);

  shadow-color: ${colors.purple};
  shadow-offset: {width: 0, height: 2};
  shadow-opacity: 0.1;
  shadow-radius: 3;
  elevation: 6;
`;

export const Spinner = styled.ActivityIndicator.attrs({
  size: 'large',
  color: colors.purple,
})``;
