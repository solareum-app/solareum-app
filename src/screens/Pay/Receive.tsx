import { Address } from '@Components/Address/Address';
import { typo } from '@Components/Styles';
import { LightningRewards } from '@Containers/LightningRewards/LightningRewards';
import { useLocalize } from '@Core/AppProvider/LocalizeProvider';
import { usePrice } from '@Core/AppProvider/PriceProvider';
import Clipboard from '@react-native-community/clipboard';
import { MESSAGE_TYPE } from '@Screens/EventMessage/EventMessage';
import { COLORS } from '@Theme/colors';
import React from 'react';
import { DeviceEventEmitter, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

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
