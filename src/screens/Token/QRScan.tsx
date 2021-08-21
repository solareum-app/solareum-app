import React from 'react';

import { StyleSheet, View, Text, Dimensions } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

import { COLORS } from '../../theme';

const w = Dimensions.get('window').width;

const qr = StyleSheet.create({
  qrContainer: {
    backgroundColor: COLORS.dark0,
    height: 560,
    position: 'relative',
  },
  rqCodeScannerContainer: {
    height: 250,
  },
  camera: {
    width: 250,
    height: 250,
    marginBottom: 180,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  textWrp: {
    textAlign: 'center',
    position: 'absolute',
    marginBottom: 40,
    bottom: 0,
  },
  bottomText: {
    color: COLORS.white4,
    width: w,
    textAlign: 'center',
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
        cameraType="back"
      />
      <View style={qr.textWrp}>
        <Text style={qr.bottomText}>Hãy scan mã QR</Text>
      </View>
    </View>
  );
};
