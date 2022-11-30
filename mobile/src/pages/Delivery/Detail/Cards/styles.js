import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

import colors from '~/styles/colors';

export const Container = styled.View`
  height: 85px;
  width: 335px;
  background: #fff;
  border-radius: 4px;
  margin-top: 10px;
  flex-direction: row;

  shadow-color: ${colors.purple + '66'};
  shadow-offset: {width: 0, height: 2};
  shadow-opacity: 0.15;
  shadow-radius: 3;
  elevation: 10;
`;

export const Label = styled.Text`
  margin-top: 5px;
  font-size: 11px;
  line-height: 14px;
  text-align: center;
  width: 56px;
  color: #999999;
`;

export const Left = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  border-right-color: ${colors.border};
  border-style: solid;
  border-right-width: 1px;
`;

export const Center = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Right = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;

  border-left-color: ${colors.border};
  border-style: solid;
  border-left-width: 1px;
`;
