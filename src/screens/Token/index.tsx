import { CryptoIcon } from '@Components/CryptoIcon';
import { FacebookWebView } from '@Components/Modals/FacebookWebView';
import { FixedContent } from '@Components/Modals/FixedContent';
import { RoundedButton } from '@Components/RoundedButton';
import { grid, typo } from '@Components/Styles';
import { useLocalize } from '@Core/AppProvider/LocalizeProvider';
import { usePrice } from '@Core/AppProvider/PriceProvider';
import { useToken } from '@Core/AppProvider/TokenProvider';
import { COLORS } from '@Theme/colors';
import { price } from '@Utils/autoRound';
import React, { useEffect, useRef, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Portal } from 'react-native-portalize';
import { MoonPayWidget } from '../Moonpay/MoonPayWidget';
import { TransferAction } from '../Wallet';
import { Market } from './Market';
import { Receive } from './Receive';
import { Send } from './Send';

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
  section: {
    marginBottom: 24,
  },
});

const Token = ({ route }) => {
  const {
    action,
    initAddress,
    token,
    client_id,
    quantity,
    e_usd,
    redirect = '',
  } = route.params;

  const { accountList } = usePrice();
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(token);
  const [address, setAddress] = useState(initAddress);
  const [quantitySend, setQuantitySend] = useState(quantity);
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
    setAccount(token);
  }, [token]);
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

  useEffect(() => {
    setQuantitySend(quantity);
    setAddress(initAddress);
    setTimeout(() => {
      if (action === TransferAction.send) {
        openSendScreen();
      }
    }, 100);
  }, [route]);

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
          {amount === 0 ? (
            <View style={s.section}>
              <MoonPayWidget />
            </View>
          ) : null}
        </View>
      </ScrollView>

      <Portal>
        <FixedContent
          ref={refSend}
          onClose={() => {
            setAddress(undefined);
            setQuantitySend(undefined);
          }}
        >
          <Send
            initStep={1}
            initAddress={address}
            token={account}
            client_id={client_id}
            quantity={quantitySend}
            e_usd={e_usd}
            urlRedirect={redirect}
          />
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
