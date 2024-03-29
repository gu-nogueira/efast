import React from 'react';
import { StyleSheet } from 'react-native';
import styled, { css } from 'styled-components/native';
import { Camera as RNVisionCamera } from 'react-native-vision-camera';

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
  top: -73px;
`;

export const CaptureImage = styled.View`
  width: 335px;
  /* height: 600px; */
  max-height: 88%;
  min-height: 445px;
  margin-bottom: 11px;
`;

// const _Camera = ({ device, forwardedRef }) => (
//   <RNVisionCamera
//     device={device}
//     ref={forwardedRef}
//     isActive={true}
//     photo={true}
//   />
// );

// export const Camera = styled(_Camera)`
//   width: 100%;
//   height: 100%;
//   max-height: 445px;
//   min-height: 445px;
//   align-items: center;
// `;

export const Camera = styled(RNVisionCamera).attrs(
  ({ device, forwardedRef }) => ({
    device,
    ref: forwardedRef,
    isActive: true,
    photo: true,
  }),
)`
  width: 100%;
  height: 100%;
  max-height: 445px;
  min-height: 445px;
  align-items: center;
`;

export const Image = styled.ImageBackground`
  width: 335px;
  height: 88%;
  min-height: 445px;
  margin-bottom: 11px;
`;

export const Actions = styled.View`
  ${(props) =>
    !props.isCamera &&
    css`
      height: 89%;
    `};

  ${(props) =>
    props.isCamera &&
    css`
      top: -80px;
    `};
  align-items: center;
  justify-content: flex-end;
`;

export const ButtonCamera = styled.TouchableOpacity`
  background: rgba(0, 0, 0, 0.3);
  width: 61px;
  height: 61px;
  border-radius: 30px;
  align-items: center;
  justify-content: center;
  margin-bottom: 33px;
`;

export const Button = styled.TouchableOpacity`
  width: 335px;
  height: 45px;
  background: ${colors.purple};
  ${(props) =>
    props.disabled &&
    css`
      background: rgba(125, 64, 231, 0.2);
    `}
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  margin-top: -30px;
`;

export const Text = styled.Text`
  font-size: 16px;
  color: #fff;
  font-weight: bold;
`;
