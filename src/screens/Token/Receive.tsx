import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-community/clipboard';

import { COLORS } from '../../theme/colors';
import { RoundedButton } from '../../components/RoundedButton';
import { typo } from '../../components/Styles';

const s = StyleSheet.create({
  main: {
    backgroundColor: COLORS.dark0,
    minHeight: 400,
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    borderColor: 'white'
  },
  footer: {},
  control: {
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
  },
  controlItem: {
    marginLeft: 12,
    marginRight: 12,
  },
});

export const Receive = ({ token }) => {
  const address = token.publicKey;
  const copyToClipboard = () => {
    Clipboard.setString(address);
  };

  return (
    <View style={s.main}>
      <Text style={typo.title}>Nhận {token.symbol}</Text>
      <View style={s.body}>
        <View style={s.qr}>
          <QRCode value={address} size={220} />
        </View>
        <Text style={typo.address}>
          {address}
        </Text>
      </View>
      <View style={s.footer}>
        <Text style={typo.helper}>Chỉ chuyển {token.name} (SPL) vào địa chỉ này. Việc chuyển token khác vào địa chỉ này có thể dẫn đến mất toàn toàn các token&nbsp;đó.</Text>
        <View style={s.control}>
          <View style={s.controlItem}>
            <RoundedButton onClick={copyToClipboard} title="Sao chép" iconName="addfile" />
          </View>
          <View style={s.controlItem}>
            <RoundedButton onClick={() => null} title="Chia sẻ" iconName="upload" />
          </View>
        </View>
      </View>
    </View>
  )
};
