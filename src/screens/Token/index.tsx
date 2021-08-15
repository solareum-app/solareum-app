import React, { useRef, useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  RefreshControl,
} from 'react-native';
import { Portal } from 'react-native-portalize';
import Clipboard from '@react-native-community/clipboard';

import { FixedContent } from '../../components/Modals/FixedContent';
import { RoundedButton } from '../../components/RoundedButton';
import { COLORS } from '../../theme/colors';
import { grid, typo } from '../../components/Styles';
import { price } from '../../utils/autoRound';
import imgDelivering from '../../assets/clip-message-sent.png';
import { TransferAction } from '../Wallet';
import { CryptoIcon } from '../../components/CryptoIcon';

import { Send } from './Send';
import { Receive } from './Receive';
import { useApp } from '../../core/AppProvider';

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
    color: COLORS.white0,
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
  const { action, token } = route.params;
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(token);
  const { getAccountByPk } = useApp();

  const refSend = useRef();
  const refReceived = useRef();
  const { symbol = '$$$', logoURI = '', amount = 0, decimals } = account;

  const openSendScreen = () => {
    refSend?.current?.open();
  };

  const openReceiveScreen = () => {
    refReceived?.current?.open();
  };

  const onRefresh = async () => {
    setLoading(true);
    const acc = await getAccountByPk(token.publicKey);
    setAccount({ ...account, ...acc });
    setLoading(false);
  };

  useEffect(() => {
    setTimeout(() => {
      if (action === TransferAction.send) {
        openSendScreen();
      }
      if (action === TransferAction.receive) {
        openReceiveScreen();
      }
    }, 100);
  }, []);

  return (
    <View style={grid.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={[COLORS.white2]}
            tintColor={COLORS.white2}
          />
        }
      >
        <View style={grid.header}>
          <View style={s.info}>
            <CryptoIcon uri={logoURI} />
            <Text style={s.infoBalance}>
              {`${price(
                amount / Math.pow(10, decimals),
              )} ${symbol.toUpperCase()}`}
            </Text>
          </View>
          <View style={s.control}>
            <View style={s.controlItem}>
              <RoundedButton
                onClick={openSendScreen}
                title="Chuyển"
                iconName="upload"
              />
            </View>
            <View style={s.controlItem}>
              <RoundedButton
                onClick={openReceiveScreen}
                title="Nhận"
                iconName="download"
              />
            </View>
            <View style={s.controlItem}>
              <RoundedButton
                onClick={() => {
                  Clipboard.setString(token.publicKey);
                }}
                title="Copy"
                iconName="copy"
                type="feather"
              />
            </View>
          </View>
        </View>
        <View style={grid.body}>
          <View style={s.messageWrp}>
            <Image source={imgDelivering} style={s.placeholderImage} />
            <Text style={[typo.normal, s.helper]}>
              Lịch sử giao dịch sẽ hiển thị ở đây
            </Text>
          </View>
        </View>
      </ScrollView>

      <Portal>
        <FixedContent ref={refSend}>
          <Send initStep={1} token={account} />
        </FixedContent>
        <FixedContent ref={refReceived}>
          <Receive token={account} />
        </FixedContent>
      </Portal>
    </View>
  );
};

export default Token;
