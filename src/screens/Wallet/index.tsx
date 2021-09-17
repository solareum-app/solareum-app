import React, { useState } from 'react';
import {
  ScrollView,
  RefreshControl,
  View,
  Text,
  StyleSheet,
  DeviceEventEmitter,
} from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Clipboard from '@react-native-community/clipboard';
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
import { useNavigation } from '@react-navigation/native';
import { EventMessage, MESSAGE_TYPE } from '../EventMessage/EventMessage';
import { Icon } from 'react-native-elements';

const s = StyleSheet.create({
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  body: {
    padding: 10,
    paddingBottom: 20,
    marginBottom: 40,
  },
  info: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  infoBalance: {
    marginTop: 12,
    fontSize: 36,
    color: COLORS.white0,
    alignItems: 'center',
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
  manageBtn: {
    backgroundColor: COLORS.dark2,
    borderColor: COLORS.dark4,
  },
  manageIcon: {
    marginRight: 10,
  },
  txtManageBtn: {
    color: COLORS.white0,
  },
  eyeIcon: {
    marginLeft: 10,
    alignItems: 'center',
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
            <Text onPress={() => onHideBalance()} style={s.infoBalance}>
              {isHideBalance ? '****' : `$${price(totalEst)}`}
            </Text>
            {isHideBalance ? (
              <Icon
                onPress={() => onHideBalance()}
                style={s.eyeIcon}
                type="feather"
                name="eye"
                color={COLORS.white0}
                size={30}
              />
            ) : (
              <View />
            )}
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
          <Button
            buttonStyle={s.manageBtn}
            onPress={() => navigation.navigate(Routes.ManagementTokenList)}
            icon={
              <Icon
                name="sliders"
                size={15}
                style={s.manageIcon}
                color="white"
              />
            }
            title="Manage token list"
            titleStyle={s.txtManageBtn}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default WalletScreen;
