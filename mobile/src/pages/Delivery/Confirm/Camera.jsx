import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Camera as RNVisionCamera } from 'react-native-vision-camera';

const Camera = ({ device }) => {
  const cameraRef = useRef(null);

  return (
    <RNVisionCamera
      device={device}
      ref={cameraRef}
      isActive={true}
      photo={true}
      style={styles.camera}
    />
  );
};

export default Camera;

const styles = StyleSheet.create({
  camera: {
    width: '100%',
    height: '100%',
    maxHeight: '445px',
    minHeight: '445px',
    alignItems: 'center',
  },
});
