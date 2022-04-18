import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';

import { Button } from 'react-native-elements';
import { typo } from '../../../components/Styles';
import { COLORS } from '../../../theme';

const s = StyleSheet.create({
  main: {
    position: 'relative',
    backgroundColor: COLORS.dark0,
    minHeight: 400,
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  img: {
    height: 220,
    width: 220,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  footer: {
    marginTop: 20,
  },
});

export const BackupInfo = ({
  backup,
  onRequestClose,
  loading,
  done,
}: {
  backup: () => void;
  onRequestClose: () => void;
  loading: boolean;
  done: boolean;
}) => {
  console.log('BackupInfo', loading, done);

  if (done) {
    return (
      <View style={s.main}>
        <LottieView
          autoPlay
          loop
          source={require('../../../theme/lottie/check.json')}
          style={s.img}
        />
        <Text style={typo.titleLeft}>Backup completed</Text>
        <Text style={typo.normal}>
          Your wallets have been back up onto the cloud.
        </Text>
        <View style={s.footer}>
          <Button title="Okie" type="outline" onPress={onRequestClose} />
        </View>
      </View>
    );
  }

  return (
    <View style={s.main}>
      <LottieView
        autoPlay
        loop
        source={require('./data-sync.json')}
        style={s.img}
      />
      <Text style={typo.titleLeft}>Backup your wallets</Text>
      <Text style={typo.normal}>
        Your private keys will be synced to the cloud. You can backup anytime in
        case of phone damage.
      </Text>
      <View style={s.footer}>
        <Button
          title="Backup"
          type="outline"
          onPress={backup}
          loading={loading}
        />
      </View>
    </View>
  );
};
