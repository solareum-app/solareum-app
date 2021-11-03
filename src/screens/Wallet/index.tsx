import React, { useState, useRef } from 'react';
import {
  ScrollView,
  RefreshControl,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Portal } from 'react-native-portalize';

import { FixedContent } from '../../components/Modals/FixedContent';
import { Receive } from '../Token/Receive';
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
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';
import { MissionLeftButton } from '../../containers/MissionButton/MissionLeftButton';
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
  infoBalance: {
    fontSize: 36,
    lineHeight: 48,
    color: COLORS.white0,
    textAlign: 'center',
  },
  eyeIcon: {
    marginLeft: 8,
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
  manageBtnWrp: {
    margin: 20,
    marginBottom: 0,
  },
  manageBtn: {
    borderColor: COLORS.dark4,
  },
  manageIcon: {
    marginRight: 10,
  },
  txtManageBtn: {
    color: COLORS.white2,
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
  const { addressId } = useApp();
  const { loadAccountList, accountList } = useToken();
  const refReceived = useRef();
  const { t } = useLocalize();

  const solAccount = accountList.find((i) => i.mint === 'SOL');
  const xsbAccount = accountList.find((i) => i.symbol === 'XSB');
  let isAccountCreated = xsbAccount ? xsbAccount.publicKey : false;

  const activeAccountList = accountList
    .filter((i: IAccount) => i.mint && !i.isHiding)
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
          </View>
          <View style={s.control}>
            <View style={s.controlItem}>
              <RoundedButton
                onClick={() => {
                  navigation.navigate(Routes.Search, {
                    action: TransferAction.send,
                  });
                }}
                title={t('home-send')}
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
                title={t('home-receive')}
                iconName="download"
              />
            </View>
            <View style={s.controlItem}>
              <RoundedButton
                onClick={() => {
                  refReceived.current.open();
                }}
                title={t('home-qr-code')}
                iconName="square"
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
          {activeAccountList.length >= 7 ? (
            <View style={s.manageBtnWrp}>
              <Button
                title={t('home-manage-accounts')}
                onPress={() => navigation.navigate(Routes.ManagementTokenList)}
                type="outline"
                buttonStyle={s.manageBtn}
                titleStyle={s.txtManageBtn}
                icon={
                  <Icon
                    size={16}
                    style={s.manageIcon}
                    color={COLORS.white2}
                    name="eye-off"
                    type="feather"
                  />
                }
              />
            </View>
          ) : null}

          {isAccountCreated ? <MissionLeftButton /> : null}
        </View>

        <Airdrop />
      </ScrollView>

      <Portal>
        <FixedContent ref={refReceived}>
          <Receive token={solAccount} />
        </FixedContent>
      </Portal>
    </View>
  );
};

export default WalletScreen;
