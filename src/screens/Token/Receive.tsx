import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

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
    marginTop: 40,
    marginBottom: 40,
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

export const Receive = () => {
  return (
    <View style={s.main}>
      <View style={s.body}>
        <View style={s.qr}>
          <QRCode value="751dKZJazx8BrCkK1wxgLNzQcZBVzJbVgYbi8KKVe7MH" size={220} />
        </View>
        <Text style={typo.address}>
          751dKZJazx8BrCkK1wxgLNzQcZBVzJbVgYbi8KKVe7MH
        </Text>
      </View>
      <View style={s.footer}>
        <Text style={typo.helper}>Chỉ chuyển Solana (SOL) vào địa chỉ này. Việc chuyển token khác vào địa chỉ này có thể dẫn đến mất toàn toàn các token đó.</Text>
        <View style={s.control}>
          <View style={s.controlItem}>
            <RoundedButton onClick={() => null} title="Sao chép" iconName="addfile" />
          </View>
          <View style={s.controlItem}>
            <RoundedButton onClick={() => null} title="Chia sẻ" iconName="upload" />
          </View>
        </View>
      </View>
    </View>
  )
};
