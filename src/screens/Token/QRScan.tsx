import React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

import { COLORS } from '../../theme';

const qr = StyleSheet.create({
  qrContainer: {
    backgroundColor: COLORS.dark0,
    height: 500,
  },
  rqCodeScannerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: 250,
    height: 250,
  },
  bottomText: {
    color: COLORS.white0,
    top: 40,
    maxWidth: 300,
    textAlign: 'center',
  },
  buttonBack: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 99,
    padding: 20,
  },
});

export const QRScan = ({ onChange }) => {
  const onSuccess = (e: any) => {
    if (e.data) {
      onChange(e.data);
    }
  };

  return (
    <View style={qr.qrContainer}>
      <QRCodeScanner
        containerStyle={qr.rqCodeScannerContainer}
        cameraStyle={qr.camera}
        onRead={onSuccess}
        bottomContent={<Text style={qr.bottomText}>Hãy scan mã QR</Text>}
        cameraType="back"
      />
    </View>
  );
};
