import React, { useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Portal } from 'react-native-portalize';
import { FixedContent } from '../../components/Modals/FixedContent';

import { RoundedButton } from '../../components/RoundedButton';
import { COLORS } from '../../theme/colors';
import { grid, typo } from '../../components/Styles';
import { balanceFormat } from '../../utils/balanceFormat';
import imgDelivering from '../../assets/clip-message-sent.png';

import { Send } from './Send';
import { Receive } from './Receive';

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

const Token = ({ route }) => {
  const token = route.params.token;
  const refSend = useRef();
  const refReceived = useRef();

  const {
    symbol = '---',
    logoURI = '',
    amount,
    decimals,
  } = token;

  const openSendScreen = () => {
    refSend?.current?.open();
  }
  const openReceiveScreen = () => {
    refReceived?.current?.open();
  }

  return (
    <View style={grid.container}>
      <ScrollView>
        <View style={grid.header}>
          <View style={s.info}>
            <Avatar
              size="medium"
              rounded
              source={{
                uri: logoURI
              }} />
            <Text style={s.infoBalance}>
              {`${balanceFormat.format(amount / Math.pow(10, decimals))} ${symbol.toUpperCase()}`}
            </Text>
          </View>
          <View style={s.control}>
            <View style={s.controlItem}>
              <RoundedButton onClick={openSendScreen} title="Chuyển" iconName="upload" />
            </View>
            <View style={s.controlItem}>
              <RoundedButton onClick={openReceiveScreen} title="Nhận" iconName="download" />
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

      <Portal>
        <FixedContent ref={refSend}>
          <Send initStep={1} token={token} />
        </FixedContent>
        <FixedContent ref={refReceived}>
          <Receive token={token} />
        </FixedContent>
      </Portal>
    </View>
  );
};

export default Token;
