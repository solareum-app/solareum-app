import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { Portal } from 'react-native-portalize';
import { LoadingImage } from '../../components/LoadingIndicator';
import { FixedContent } from '../../components/Modals/FixedContent';
import { RoundedButton } from '../../components/RoundedButton';
import { grid, typo } from '../../components/Styles';
import TokensList from '../../components/TokenList';
import { useApp } from '../../core/AppProvider/AppProvider';
import { IAccount } from '../../core/AppProvider/IAccount';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';
import { usePrice } from '../../core/AppProvider/PriceProvider';
import { useToken } from '../../core/AppProvider/TokenProvider';
import { Routes } from '../../navigators/Routes';
import { COLORS } from '../../theme';
import { price } from '../../utils/autoRound';
import { Receive } from '../Token/Receive';
import { BackupNotice } from './BackupNotice';
import Header from './Header';

const s = StyleSheet.create({
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  body: {
    padding: 10,
    paddingBottom: 20,
    marginBottom: 24,
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
  loadingWrp: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 240,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  blankSpace: {
    height: 40,
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
  const [load, setLoad] = useState(0);
  const [isHideBalance, setIsHideBalance] = useState(false);

  const navigation = useNavigation();
  const refReceived = useRef();

  const { loadAccountList } = useToken();
  const { isAddressBackup } = useApp();
  const { accountList } = usePrice();
  const { t } = useLocalize();

  const solAccount = accountList.find((i) => i.mint === 'SOL');

  let activeAccountList = accountList
    .filter((i: IAccount) => i.mint && !i.isHiding)
    .sort((a, b) => {
      return b.refValue - a.refValue;
    });

  // add XSB and USDC into the list if it hasn't created yet
  const isXSBCreated = accountList.filter(
    (i) => i.mint && i.symbol === 'XSB',
  ).length;
  const isUSDCCreated = accountList.filter(
    (i) => i.mint && i.symbol === 'USDC',
  ).length;
  if (isXSBCreated === 0) {
    const xsbAcc = accountList.filter((i) => i.symbol === 'XSB');
    activeAccountList = activeAccountList.concat(xsbAcc);
  }

  if (isUSDCCreated === 0) {
    const usdcAcc = accountList.filter((i) => i.symbol === 'USDC');
    activeAccountList = activeAccountList.concat(usdcAcc);
  }

  const totalEst = getTotalEstimate(activeAccountList);

  const onRefresh = async () => {
    try {
      setLoading(true);
      setLoad(load + 1);
      await loadAccountList();
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const toggleHideBalance = () => {
    setIsHideBalance(!isHideBalance);
  };

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
            <Text style={s.infoBalance} onPress={toggleHideBalance}>
              {isHideBalance ? '****' : `$${price(totalEst)}`}
            </Text>
          </View>
          <View style={s.control}>
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
                onClick={() => navigation.navigate(Routes.Swap)}
                title={t('home-swap')}
                iconName="refresh-cw"
                type="feather"
              />
            </View>
          </View>
        </View>

        <View>{!isAddressBackup ? <BackupNotice /> : null}</View>

        <View style={[grid.body, s.body]}>
          {!activeAccountList.length ? (
            <View style={s.loadingWrp}>
              <LoadingImage />
              <Text style={typo.normal}>{t('home-account-loading')}</Text>
            </View>
          ) : null}

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
        </View>
        <View style={s.blankSpace} />
      </ScrollView>

      <Portal>
        <FixedContent ref={refReceived}>
          <Receive
            token={solAccount}
            navigation={navigation}
            refReceived={refReceived}
          />
        </FixedContent>
      </Portal>
    </View>
  );
};

export default WalletScreen;
