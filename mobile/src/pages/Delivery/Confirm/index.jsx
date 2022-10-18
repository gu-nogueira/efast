import React, { useState, useRef, useEffect } from 'react';
import { Platform, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import {
  useCameraDevices,
  Camera as RNVisionCamera,
} from 'react-native-vision-camera';

import Icon from 'react-native-vector-icons/MaterialIcons';
// import Spinner from 'react-native-loading-spinner-overlay';

import api from '~/services/api';

import errorParser from '~/utils/errorParser';

// import Camera from './Camera';

import defaultSignatureimage from '~/assets/signature.png';

import {
  Container,
  Background,
  Content,
  CaptureImage,
  Image,
  // Camera,
  Actions,
  ButtonCamera,
  Button,
  Text,
} from './styles';

const Confirm = ({ navigation, route }) => {
  const { id: deliveryId } = route.params;

  const cameraRef = useRef(null);

  const devices = useCameraDevices();
  const device = devices.back;

  const [showCamera, setShowCamera] = useState(false);
  const [takeImage, setTakeImage] = useState('');
  const [dataImage, setDataImage] = useState({});
  const [loading, setLoading] = useState(false);

  const profile = useSelector((state) => state.user.profile);

  async function getCameraPermissionStatus() {
    const currentStatus = await RNVisionCamera.getCameraPermissionStatus();
    if (currentStatus !== 'authorized') {
      const newStatus = await RNVisionCamera.requestCameraPermission();
      setShowCamera(newStatus);
    }
    setShowCamera(currentStatus);
  }

  useEffect(() => {
    getCameraPermissionStatus();
  }, []);

  useEffect(() => {
    console.tron.log(takeImage);
  }, [takeImage]);

  async function takePicture() {
    async function resolveNativePictureMethod() {
      if (Platform.OS === 'ios') {
        return await cameraRef.current.takePhoto();
      }
      return await cameraRef.current.takeSnapshot({ quality: 90 });
    }
    if (cameraRef.current !== null) {
      const photo = await resolveNativePictureMethod();
      console.tron.log('photooooooooo', photo);
      console.log('cameraRef', cameraRef.current);
      setTakeImage(`file://${photo.path}?${new Date()}`);
      setDataImage(photo);
      setShowCamera(false);
    }
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const data = new FormData();
      data.append('file', {
        uri: `file://${dataImage.path}`,
        name: 'signature.jpg',
        type: 'image/jpeg',
      });
      const response = await api.post('files', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await api.put(
        `/deliverymen/${profile.id}/deliveries/${deliveryId}`,
        { signature_id: response.data.id },
        {
          params: {
            end_date: new Date().toISOString(),
          },
        },
      );

      setLoading(false);
      navigation.navigate('Dashboard');
    } catch (err) {
      setLoading(false);
      Alert.alert(
        'Não foi possível confirmar a entrega',
        err.response?.data?.error
          ? errorParser(err.response.data.error)
          : 'Ocorreu um erro inesperado para concluir a entrega do produto',
      );
      console.tron.error(err);
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
          textContent="Concluindo entrega"
          textStyle={{ color: '#fff' }}
        /> */}
        {showCamera && !!device ? (
          <CaptureImage>
            {/* <Camera device={device} ref={cameraRef} /> */}
            <RNVisionCamera
              device={device}
              ref={cameraRef}
              isActive={true}
              photo={true}
              style={styles.camera}
            />
            <Actions isCamera={showCamera}>
              <ButtonCamera onPress={takePicture}>
                <Icon name="photo-camera" size={25} color="#fff" />
              </ButtonCamera>
            </Actions>
          </CaptureImage>
        ) : (
          <>
            <Image
              source={takeImage ? { uri: takeImage } : defaultSignatureimage}>
              <Actions>
                <ButtonCamera onPress={getCameraPermissionStatus}>
                  <Icon name="photo-camera" size={25} color="#fff" />
                </ButtonCamera>
              </Actions>
            </Image>
            <Button disabled={!takeImage} onPress={handleSubmit}>
              <Text>Enviar</Text>
            </Button>
          </>
        )}
      </Content>
    </Container>
  );
};

Confirm.propTypes = {
  navigation: PropTypes.shape().isRequired,
};

export default Confirm;

const styles = StyleSheet.create({
  camera: {
    width: '100%',
    height: '100%',
    // maxHeight: '445px',
    // minHeight: '445px',
    alignItems: 'center',
  },
});
