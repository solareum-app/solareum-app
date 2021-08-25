import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, DeviceEventEmitter } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-community/clipboard';
import { Button } from 'react-native-elements';
import { PublicKey } from '@solana/web3.js';

import { LoadingImage } from '../../components/LoadingIndicator';
import { COLORS } from '../../theme/colors';
import { RoundedButton } from '../../components/RoundedButton';
import { typo } from '../../components/Styles';
import { useApp } from '../../core/AppProvider';
import { wait } from '../../utils';
import { MESSAGE_TYPE } from '../EventMessage/EventMessage';
import { EventMessage } from '../EventMessage/EventMessage';

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

export const Receive = ({ token }) => {
  const { accountList, wallet, loadAccountList } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useSol, setUseSol] = useState(false);
  const [mintAccountFee, setMintAccountFee] = useState<number>(0);
  const [account, setAccount] = useState(token);

  const sol = accountList.find((i) => i.mint === 'SOL') || {
    publicKey: '-',
    decimals: 8,
  };
  const address = account.isMinted ? account.publicKey : sol.publicKey;

  const copyToClipboard = () => {
    Clipboard.setString(address);
    DeviceEventEmitter.emit(MESSAGE_TYPE.copy, address);
  };

  const pollingAccount = async (no: number) => {
    if (no < 0) {
      return;
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
      await wallet.createTokenAccount(new PublicKey(account.address));
      const acc = await pollingAccount(MAX_TRY);
      setAccount(acc);
    } catch (err) {
      setError('Có lỗi xảy ra, vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  const dismiss = () => {
    setUseSol(true);
  };

  useEffect(() => {
    const acc = accountList.find((i) => i.address === token.address);
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
      <Text style={typo.title}>Nhận {account.symbol}</Text>

      {!account.isMinted && !useSol ? (
        <View>
          {!loading ? (
            <View>
              <View style={s.body}>
                <View>
                  <Text style={[typo.warning, s.warning]}>
                    Bạn chưa có tài khoản {account.symbol}
                  </Text>
                  <Text style={typo.normal}>
                    Bạn vẫn có thể nhận token từ địa chỉ Solana, nhưng một số
                    nhà phát hành token sẽ từ chối dùng địa chỉ Solana, vì họ sẽ
                    phải chịu phí khởi tạo tài&nbsp;khoản.
                  </Text>
                  <Text style={typo.normal}>
                    Việc tạo tài khoản sẽ giúp bạn thuận tiện hơn trong việc
                    chuyển và nhận token. Chúng tôi khuyên bạn nên thực hiện
                    hành động này. Bạn có đồng ý tạo tài&nbsp;khoản?
                  </Text>
                  <Text style={typo.normal}>Phí: {mintAccountFee} SOL</Text>
                  {error ? <Text style={typo.critical}>{error}</Text> : null}
                </View>
              </View>
              <View style={s.footer}>
                <Button
                  type="outline"
                  title={`Okie, Tạo tài khoản ${account.symbol}`}
                  onPress={() => {
                    createTokenAccount();
                  }}
                />
                <Button
                  type="clear"
                  title="Nhận qua địa chỉ Solana"
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
                  <Text style={typo.normal}>Đang tạo tài khoản...</Text>
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
            <Text style={typo.helper}>
              Chỉ chuyển {account.name} (SPL) vào địa chỉ này. Việc chuyển token
              khác vào địa chỉ này có thể dẫn đến mất toàn toàn các
              token&nbsp;đó.
            </Text>
            <View style={s.control}>
              <View style={s.controlItem}>
                <RoundedButton
                  onClick={copyToClipboard}
                  title="Sao chép"
                  iconName="addfile"
                />
              </View>
              <View style={s.controlItem}>
                <RoundedButton
                  onClick={() => null}
                  title="Chia sẻ"
                  iconName="upload"
                />
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
