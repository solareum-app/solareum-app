import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import { Avatar } from 'react-native-elements';

import { RoundedButton } from '../../components/RoundedButton';
import { COLORS } from '../../theme/colors';
import { grid, typo } from '../../components/Styles';
import imgDelivering from '../../assets/clip-message-sent.png';

const s = StyleSheet.create({
  header: {},
  info: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  infoBalance: {
    marginTop: 12,
    fontSize: 28,
    color: COLORS.white0
  },
  control: {
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
  },
  controlItem: {
    marginLeft: 12,
    marginRight: 12,
  },
  messageWrp: {
    marginTop: 80,
  },
  placeholderImage: {
    width: 240,
    height: 120,
    marginBottom: 16,
    marginLeft: 'auto',
    marginRight: 'auto',
    opacity: 0.75,
  },
  helper: {
    textAlign: 'center',
    opacity: 0.75,
  },
});

const Token = () => {
  return (
    <View style={grid.container}>
      <ScrollView>
        <View style={grid.header}>
          <View style={s.info}>
            <Avatar
              size="large"
              rounded
              source={{
                uri: "https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/solana/info/logo.png"
              }} />
            <Text style={s.infoBalance}>
              {'549.52 SOL'}
            </Text>
          </View>
          <View style={s.control}>
            <View style={s.controlItem}>
              <RoundedButton onClick={() => null} title="Chuyển" iconName="upload" />
            </View>
            <View style={s.controlItem}>
              <RoundedButton onClick={() => null} title="Nhận" iconName="download" />
            </View>
          </View>
        </View>
        <View style={grid.body}>
          <View style={s.messageWrp}>
            <Image source={imgDelivering} style={s.placeholderImage} />
            <Text style={[typo.normal, s.helper]}>Lịch sử giao dịch sẽ hiển thị ở đây</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Token;
