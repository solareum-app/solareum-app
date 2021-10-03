import React from 'react';

import { StyleSheet, View, Text, Dimensions } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Button } from 'react-native-elements';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';

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
  footer: {
    textAlign: 'center',
    position: 'absolute',
    paddingHorizontal: 20,
    marginBottom: 40,
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomText: {
    color: COLORS.white4,
    textAlign: 'center',
    marginBottom: 8,
  },
  closeButton: {
    color: COLORS.critical,
  },
});

export const QRScan = ({ onChange }) => {
  const { t } = useLocalize();

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
      <View style={qr.footer}>
        <Text style={qr.bottomText}>{t('token-qr-scan')}</Text>
        <Button
          title={t('token-qr-cancel')}
          titleStyle={qr.closeButton}
          type="clear"
          onPress={() => {
            onChange('');
          }}
        />
      </View>
    </View>
  );
};
