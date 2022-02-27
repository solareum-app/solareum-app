import React from 'react';
import { View, Text, StyleSheet, DeviceEventEmitter } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-community/clipboard';

import { COLORS } from '../../theme/colors';
import { typo } from '../../components/Styles';
import { MESSAGE_TYPE } from '../EventMessage/EventMessage';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';
import { usePrice } from '../../core/AppProvider/PriceProvider';
import { Address } from '../../components/Address/Address';
import { LightningRewards } from '../../containers/LightningRewards/LightningRewards';

const s = StyleSheet.create({
  main: {
    position: 'relative',
    backgroundColor: COLORS.dark0,
    padding: 20,
    paddingBottom: 40,
    borderRadius: 12,
    margin: 20,
    marginTop: 40,
    marginBottom: 40,
  },
  body: {
    marginTop: 20,
    marginBottom: 20,
  },
  qr: {
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 4,
    borderWidth: 16,
    marginBottom: 20,
    borderColor: 'white',
  },
  footer: {},
  section: {
    marginBottom: 40,
    paddingHorizontal: 20,
  },
});

export const Receive = () => {
  const { t } = useLocalize();
  const { accountList } = usePrice();

  const solAccount = accountList.find((i) => i.mint === 'SOL');
  const address = solAccount.publicKey;

  const copyToClipboard = () => {
    Clipboard.setString(address);
    DeviceEventEmitter.emit(MESSAGE_TYPE.copy, address);
  };

  return (
    <View>
      <View style={s.main}>
        <Text style={typo.title}>Receive Tokens</Text>
        <View style={s.body}>
          <View style={s.qr}>
            <QRCode value={address} size={240} />
          </View>
          <Address copyToClipboard={copyToClipboard} address={address} />
        </View>
        <View style={s.footer}>
          <Text style={typo.helper}>{t('receive-note-01')}</Text>
          <Text style={typo.helper}>
            {t('receive-note-02', { name: 'SOL' })}
          </Text>
        </View>
      </View>

      <View style={s.section}>
        <LightningRewards />
      </View>
    </View>
  );
};
