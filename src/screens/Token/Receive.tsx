import Clipboard from '@react-native-community/clipboard';
import { PublicKey } from '@solana/web3.js';
import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, StyleSheet, Text, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import QRCode from 'react-native-qrcode-svg';
import { Address } from '../../components/Address/Address';
import { LoadingImage } from '../../components/LoadingIndicator';
import { typo } from '../../components/Styles';
import { useApp } from '../../core/AppProvider/AppProvider';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';
import { usePrice } from '../../core/AppProvider/PriceProvider';
import { useToken } from '../../core/AppProvider/TokenProvider';
import Routes from '../../navigators/Routes';
import { COLORS } from '../../theme/colors';
import { wait } from '../../utils';
import { EventMessage, MESSAGE_TYPE } from '../EventMessage/EventMessage';

const s = StyleSheet.create({
  main: {
    position: 'relative',
    backgroundColor: COLORS.dark0,
    minHeight: 400,
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  body: {
    marginTop: 20,
    marginBottom: 20,
  },
  qr: {
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 4,
    borderWidth: 16,
    marginBottom: 20,
    borderColor: 'white',
  },
  footer: {
    marginBottom: 24,
  },
  section: {
    marginTop: 20,
  },
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
  button: {
    marginTop: 8,
  },
  loadingWrp: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 240,
  },
  warning: { marginBottom: 16 },
  notificationWrp: {
    position: 'relative',
    zIndex: 9999,
    marginLeft: -20,
    marginRight: -20,
  },
  buttonStyle: {
    backgroundColor: '#9945FF',
  },
  buttonIcon: {
    marginRight: 4,
  },
});

const MAX_TRY = 24;
const WAIT_TIME = 10000; // 10s -> 4mins for total

export const Receive = ({ token = {}, navigation = {}, refReceived }) => {
  const { wallet } = useApp();
  const { loadAccountList } = useToken();
  const { accountList } = usePrice();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mintAccountFee, setMintAccountFee] = useState<number>(0);
  const [account, setAccount] = useState(token);
  const [createNewAccount, setCreateNewAccount] = useState(false);
  const { t } = useLocalize();
  const isAccountCreated = account && account.publicKey;

  const sol = accountList.find((i) => i.mint === 'SOL') || {
    publicKey: wallet?.publicKey?.toBase58(),
    decimals: 8,
  };
  const address = sol.publicKey;

  const onPressHandler = () => {
    navigation.navigate(Routes.AddressManagement);
    refReceived.current?.close();
  };

  const copyToClipboard = () => {
    Clipboard.setString(address);
    DeviceEventEmitter.emit(MESSAGE_TYPE.copy, address);
  };

  // const copyRewardsLink = async () => {
  //   const lrLinkId = `${KEY_LR}-${account.symbol}`;
  //   let link = await getItem(lrLinkId, address);
  //   if (!link) {
  //     link = await getLRLink(address, account.symbol);
  //     await setItem(lrLinkId, address, link);
  //   }

  //   try {
  //     const result = await Share.share({
  //       message,
  //     });
  //     return result;
  //   } catch {
  //     // TODO: track this issue then
  //   }
  // };

  const pollingAccount = async (no: number) => {
    if (no < 0) {
      return null;
    }
    const list = await loadAccountList();
    const acc = list.find((i) => i.address === account.address) || {};
    if (!acc.publicKey) {
      await wait(WAIT_TIME);
      return pollingAccount(no - 1);
    }
    return acc;
  };

  const createTokenAccount = async () => {
    setLoading(true);
    try {
      await wallet.createAssociatedTokenAccount(new PublicKey(account.address));
      const acc = await pollingAccount(MAX_TRY);
      if (acc) {
        setAccount(acc);
      }
    } catch (err) {
      setError(t('sys-error'));
    } finally {
      setLoading(false);
      setCreateNewAccount(false);
    }
  };

  const dismiss = () => {
    setCreateNewAccount(false);
  };

  useEffect(() => {
    // dont update accoutn when token is created
    if (token.publicKey) {
      return;
    }

    let acc = accountList.find((i) => i.address === token.address);
    if (acc) {
      setAccount(acc);
    }
  }, [accountList]);

  useEffect(() => {
    (async () => {
      const fee = await wallet.tokenAccountCost();
      setMintAccountFee(fee / Math.pow(10, sol.decimals));
    })();
  }, []);

  return (
    <View style={s.main}>
      <View style={s.notificationWrp}>
        <EventMessage top={36} />
      </View>
      <Text style={typo.title}>
        {t('receive-title', { symbol: account.symbol || 'SOL' })}
      </Text>

      {createNewAccount ? (
        <View>
          {!loading ? (
            <View>
              <View style={s.body}>
                <Text style={[typo.warning, s.warning]}>
                  {t('receive-account-not-created', { symbol: account.symbol })}
                </Text>
                <Text style={typo.normal}>
                  {t('receive-account-message-01')}
                </Text>
                <Text style={typo.normal}>
                  {t('receive-account-message-02')}
                </Text>
                <Text style={typo.normal}>
                  {t('receive-mint-account-fee', { mintAccountFee })}
                </Text>
                {error ? <Text style={typo.critical}>{error}</Text> : null}
              </View>
              <View style={s.footer}>
                <Button
                  type="outline"
                  title={t('receive-create-account', {
                    symbol: account.symbol,
                  })}
                  onPress={() => {
                    createTokenAccount();
                  }}
                />
                <Button
                  type="clear"
                  title={t('receive-dismiss')}
                  containerStyle={s.button}
                  onPress={dismiss}
                />
              </View>
            </View>
          ) : (
            <View>
              <View style={s.body}>
                <View style={s.loadingWrp}>
                  <LoadingImage />
                  <Text style={typo.normal}>
                    {t('receive-account-creating')}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      ) : (
        <View>
          <View style={s.body}>
            <View style={s.qr}>
              <QRCode value={address} size={220} />
            </View>
            <Address copyToClipboard={copyToClipboard} address={address} />

            <View style={s.section}>
              <Button
                title={t('create-FIO-address')}
                buttonStyle={s.buttonStyle}
                onPress={onPressHandler}
                icon={
                  <Icon
                    name="zap"
                    type="feather"
                    size={20}
                    color={COLORS.white0}
                    style={s.buttonIcon}
                  />
                }
              />
            </View>
          </View>
          <View style={s.footer}>
            <Text style={typo.helper}>{t('receive-note-01')}</Text>
            <Text style={typo.helper}>
              {t('receive-note-02', { name: account.name })}
            </Text>

            {!isAccountCreated && account.symbol ? (
              <View style={s.control}>
                <Button
                  type="clear"
                  title={t('receive-create-account-02', {
                    symbol: account.symbol,
                  })}
                  onPress={() => {
                    setCreateNewAccount(true);
                  }}
                />
              </View>
            ) : null}
          </View>
        </View>
      )}
    </View>
  );
};
