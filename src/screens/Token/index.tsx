import React, { useRef, useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Portal } from 'react-native-portalize';

import { FixedContent } from '../../components/Modals/FixedContent';
import { FacebookWebView } from '../../components/Modals/FacebookWebView';
import { RoundedButton } from '../../components/RoundedButton';
import { COLORS } from '../../theme/colors';
import { grid, typo } from '../../components/Styles';
import { price } from '../../utils/autoRound';
import { TransferAction } from '../Wallet';
import { CryptoIcon } from '../../components/CryptoIcon';
import { useToken } from '../../core/AppProvider/TokenProvider';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';

import { Send } from './Send';
import { Receive } from './Receive';
import { Market } from './Market';
import { usePrice } from '../../core/AppProvider/PriceProvider';

const s = StyleSheet.create({
  header: {
    ...grid.header,
    paddingBottom: 20,
  },
  info: {
    flex: 1,
    alignItems: 'center',
    marginTop: 36,
    marginBottom: 24,
  },
  infoBalance: {
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
  est: {
    ...typo.normal,
    marginBottom: 0,
    lineHeight: 20,
  },
  name: {
    ...typo.helper,
    marginTop: 12,
    marginBottom: 0,
  },
});

const Token = ({ route }) => {
  const { action, token, initAddress = '' } = route.params;

  const { accountList } = usePrice();
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(token);

  const { getAccountByPk, toggleAccountByPk } = useToken();
  const { t } = useLocalize();

  const refTransactionHistory = useRef();
  const refSend = useRef();
  const refReceived = useRef();

  const {
    symbol = '$$$',
    logoURI = '',
    amount = 0,
    decimals,
    name,
    usd,
  } = account;
  const est = (amount / Math.pow(10, decimals)) * usd;

  const openSendScreen = () => {
    refSend?.current?.open();
  };

  const openReceiveScreen = () => {
    refReceived?.current?.open();
  };

  const onRefresh = async () => {
    setLoading(true);
    try {
      const acc = await getAccountByPk(account.publicKey);
      setAccount({ ...account, ...acc });
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const acc = accountList.find((i) => i.publicKey === account.publicKey);
    if (account.publicKey && acc) {
      setAccount(acc);
    }
  }, [accountList]);

  useEffect(() => {
    // open action panel
    setTimeout(() => {
      if (action === TransferAction.send) {
        openSendScreen();
      }
      if (action === TransferAction.receive) {
        openReceiveScreen();
        if (token.publicKey) {
          toggleAccountByPk(token.publicKey, 1);
        }
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
        <View style={s.header}>
          <View style={s.info}>
            <CryptoIcon uri={logoURI} size={56} />
            <Text style={s.name}>{name}</Text>
            <Text style={s.infoBalance}>
              {`${price(
                amount / Math.pow(10, decimals),
                decimals,
              )} ${symbol.toUpperCase()}`}
            </Text>
            <Text style={s.est}>≈${price(est)}</Text>
          </View>
          <View style={s.control}>
            <View style={s.controlItem}>
              <RoundedButton
                onClick={openSendScreen}
                title={t('sys-send')}
                iconName="upload"
              />
            </View>
            <View style={s.controlItem}>
              <RoundedButton
                onClick={openReceiveScreen}
                title={t('sys-receive')}
                iconName="download"
              />
            </View>
            <View style={s.controlItem}>
              <RoundedButton
                onClick={() => {
                  refTransactionHistory.current?.open();
                }}
                title={t('sys-tx')}
                iconName="zap"
                type="feather"
              />
            </View>
          </View>
        </View>

        <View style={grid.body}>
          <Market symbol={symbol} />
        </View>
      </ScrollView>

      <Portal>
        <FixedContent ref={refSend}>
          <Send initStep={1} token={account} initAddress={initAddress} />
        </FixedContent>

        <FixedContent ref={refReceived}>
          <Receive token={account} />
        </FixedContent>

        <FacebookWebView
          ref={refTransactionHistory}
          url={`https://solscan.io/account/${account.publicKey}`}
        />
      </Portal>
    </View>
  );
};

export default Token;
