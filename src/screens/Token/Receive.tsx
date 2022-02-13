import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  DeviceEventEmitter,
  Share,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-community/clipboard';
import { Button } from 'react-native-elements';
import { PublicKey } from '@solana/web3.js';

import { LoadingImage } from '../../components/LoadingIndicator';
import { COLORS } from '../../theme/colors';
import { RoundedButton } from '../../components/RoundedButton';
import { typo } from '../../components/Styles';
import { useApp } from '../../core/AppProvider/AppProvider';
import { useToken } from '../../core/AppProvider/TokenProvider';
import { wait } from '../../utils';
import { MESSAGE_TYPE } from '../EventMessage/EventMessage';
import { EventMessage } from '../EventMessage/EventMessage';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';
import { usePrice } from '../../core/AppProvider/PriceProvider';

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
  footer: {},
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
});

const MAX_TRY = 24;
const WAIT_TIME = 10000; // 10s -> 4mins for total

const getLRLink = (address: string, token: string = 'XSB') => {
  return `https://solareum.page.link/rewards?address=${address}&token=${token}`;
};

export const Receive = ({ token = {} }) => {
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

  const copyToClipboard = () => {
    Clipboard.setString(address);
    DeviceEventEmitter.emit(MESSAGE_TYPE.copy, address);
  };

  const copyRewardsLink = async () => {
    const link = getLRLink(address);
    Clipboard.setString(link);
    DeviceEventEmitter.emit(MESSAGE_TYPE.copy, address);

    try {
      const result = await Share.share({
        message: link,
      });
      return result;
    } catch {
      // TODO: track this issue then
    }
  };

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

  const onShare = async () => {
    try {
      const result = await Share.share({ message: address });
      return result;

      // ref: https://reactnative.dev/docs/share
      // if (result.action === Share.sharedAction) {
      //   if (result.activityType) {
      //   } else {
      //   }
      // }
      // if (result.action === Share.dismissedAction) {
      // }
    } catch {
      // TODO: track this issue then
    }
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
            <Text style={typo.address}>{address}</Text>
          </View>
          <View style={s.footer}>
            <Text style={typo.helper}>{t('receive-note-01')}</Text>
            <Text style={typo.helper}>
              {t('receive-note-02', { name: account.name })}
            </Text>
            <View style={s.control}>
              <View style={s.controlItem}>
                <RoundedButton
                  onClick={copyToClipboard}
                  title={t('receive-copy')}
                  iconName="addfile"
                />
              </View>
              <View style={s.controlItem}>
                <RoundedButton
                  onClick={() => onShare()}
                  title={t('receive-share')}
                  iconName="upload"
                />
              </View>
              <View style={s.controlItem}>
                <RoundedButton
                  isRewards
                  onClick={copyRewardsLink}
                  title="XSB"
                  iconName="zap"
                  type="feather"
                />
              </View>
            </View>
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
