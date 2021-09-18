import React, { useState } from 'react';
import {
  ScrollView,
  RefreshControl,
  View,
  Text,
  StyleSheet,
  DeviceEventEmitter,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Clipboard from '@react-native-community/clipboard';
import { useNavigation } from '@react-navigation/native';

import { RoundedButton } from '../../components/RoundedButton';
import { COLORS } from '../../theme';
import TokensList from '../../components/TokensList';
import Header from './Header';
import { grid } from '../../components/Styles';
import { useApp } from '../../core/AppProvider/AppProvider';
import { useToken } from '../../core/AppProvider/TokenProvider';
import { price } from '../../utils/autoRound';
import { Routes } from '../../navigators/Routes';
import { useEffect } from 'react';
import { IAccount } from '../../core/AppProvider/IAccount';
import { EventMessage, MESSAGE_TYPE } from '../EventMessage/EventMessage';
import { Airdrop } from '../Airdrop/Airdrop';

const s = StyleSheet.create({
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  body: {
    padding: 10,
    paddingBottom: 20,
    marginBottom: 40,
    minHeight: 240,
  },
  info: {
    marginTop: 20,
    marginBottom: 20,
    display: 'flex',
  },
  infoWrp: {
    marginLeft: 'auto',
    marginRight: 'auto',
    position: 'relative',
  },
  infoBalance: {
    fontSize: 36,
    color: COLORS.white0,
    textAlign: 'center',
  },
  eyeIcon: {
    marginLeft: 8,
    marginBottom: 8,
    position: 'absolute',
    right: -24,
    top: 12,
    width: 16,
    height: 16,
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
});

const getTotalEstimate = (balanceListInfo: any[]) => {
  let total = 0;
  for (let i = 0; i < balanceListInfo.length; i++) {
    const { usd, amount, decimals } = balanceListInfo[i];
    const tokenValue = (usd * amount) / Math.pow(10, decimals);
    total += tokenValue;
  }
  return total;
};

export enum TransferAction {
  send = 'send',
  receive = 'receive',
}

const WalletScreen = () => {
  const [loading, setLoading] = useState(false);
  const [isHideBalance, setIsHideBalance] = useState(false);
  const navigation = useNavigation();
  const { wallet, addressId } = useApp();
  const { loadAccountList, accountList } = useToken();

  const activeAccountList = accountList
    .filter((i: IAccount) => i.mint)
    .sort((a, b) => {
      return b.refValue - a.refValue;
    });
  const totalEst = getTotalEstimate(activeAccountList);

  const onRefresh = async () => {
    try {
      setLoading(true);
      await loadAccountList();
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const onHideBalance = () => {
    setIsHideBalance(!isHideBalance);
  };

  useEffect(() => {
    onRefresh();
  }, [addressId]);

  return (
    <View style={grid.container}>
      <EventMessage />

      <Header />
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
        <View style={s.header}>
          <View style={s.info}>
            <View style={s.infoWrp}>
              <Text onPress={() => onHideBalance()} style={s.infoBalance}>
                {isHideBalance ? '****' : `$${price(totalEst)}`}
              </Text>
              {isHideBalance ? (
                <View style={s.eyeIcon}>
                  <Icon
                    onPress={() => onHideBalance()}
                    type="feather"
                    name="eye"
                    color={COLORS.white4}
                    size={16}
                  />
                </View>
              ) : null}
            </View>
          </View>
          <View style={s.control}>
            <View style={s.controlItem}>
              <RoundedButton
                onClick={() => {
                  navigation.navigate(Routes.Search, {
                    action: TransferAction.send,
                  });
                }}
                title="Chuyển"
                iconName="upload"
              />
            </View>
            <View style={s.controlItem}>
              <RoundedButton
                onClick={() => {
                  navigation.navigate(Routes.Search, {
                    action: TransferAction.receive,
                  });
                }}
                title="Nhận"
                iconName="download"
              />
            </View>
            <View style={s.controlItem}>
              <RoundedButton
                onClick={() => {
                  const address = wallet.publicKey.toBase58();
                  Clipboard.setString(address);
                  DeviceEventEmitter.emit(MESSAGE_TYPE.copy, address);
                }}
                title="Copy"
                iconName="copy"
                type="feather"
              />
            </View>
          </View>
        </View>

        <View style={[grid.body, s.body]}>
          <TokensList
            isHideBalance={isHideBalance}
            balanceListInfo={activeAccountList}
          />
        </View>

        <Airdrop />
      </ScrollView>
    </View>
  );
};

export default WalletScreen;
