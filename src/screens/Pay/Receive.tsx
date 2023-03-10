import Clipboard from '@react-native-community/clipboard';
import React from 'react';
import { DeviceEventEmitter, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Address } from '../../components/Address/Address';
import { typo } from '../../components/Styles';
import { LightningRewards } from '../../containers/LightningRewards/LightningRewards';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';
import { usePrice } from '../../core/AppProvider/PriceProvider';
import { COLORS } from '../../theme/colors';
import { MESSAGE_TYPE } from '../EventMessage/EventMessage';

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

  const solAccount = accountList?.find((i) => i?.mint === 'SOL');
  const address: any = solAccount?.publicKey;

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
          {address && (
            <Address copyToClipboard={copyToClipboard} address={address} />
          )}
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
