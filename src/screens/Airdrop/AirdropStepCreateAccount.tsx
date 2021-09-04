import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { PublicKey } from '@solana/web3.js';
import { Button } from 'react-native-elements';

import { LoadingImage } from '../../components/LoadingIndicator';
import { useApp } from '../../core/AppProvider/AppProvider';
import { useToken } from '../../core/AppProvider/TokenProvider';
import { wait } from '../../utils';
import { typo } from '../../components/Styles';
import { CryptoIcon } from '../../components/CryptoIcon';

import { style as s } from './style';

const style = StyleSheet.create({
  iconWrp: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
  },
  body: {
    marginTop: 20,
    marginBottom: 20,
  },
  loadingWrp: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 240,
  },
});

const MAX_TRY = 24;
const WAIT_TIME = 10000; // 10s -> 4mins for total

export const AirdropStepCreateAccount = ({ next }) => {
  const { wallet } = useApp();
  const { accountList, loadAccountList } = useToken();
  const token = accountList.find((i) => i.symbol === 'XSB');
  const sol = accountList.find((i) => i.mint === 'SOL') || {
    publicKey: '-',
    decimals: 8,
  };
  let isAccountCreated = token ? token.publicKey : false;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mintAccountFee, setMintAccountFee] = useState<number>(0);
  const [account, setAccount] = useState(token);

  const pollingAccount = async (no: number) => {
    if (!account) {
      setError('Có lỗi xảy ra, vui lòng thử lại sau!');
      return;
    }
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
    if (!account) {
      setError('Có lỗi xảy ra, vui lòng thử lại sau!');
      return;
    }

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

  useEffect(() => {
    (async () => {
      const fee = await wallet.tokenAccountCost();
      setMintAccountFee(fee / Math.pow(10, sol.decimals));
    })();
  }, []);

  return (
    <View style={s.main}>
      <Text style={typo.title}>Tạo tài khoản XSB</Text>
      {!loading ? (
        <View>
          <View style={style.iconWrp}>
            <CryptoIcon uri={account?.logoURI} size={52} />
          </View>
          <Text style={typo.normal}>
            Tài khoản XSB là bắt buộc khi thực hiện giao dịch trên nền tảng
            Solana. Việc tạo tài khoản này sẽ giúp chúng tôi có thể chuyển XSB
            đến với các bạn một cách nhanh chóng và thuận tiện nhất.
          </Text>
          <Text style={typo.normal}>Phí: {mintAccountFee} SOL</Text>
          {error ? <Text style={typo.critical}>{error}</Text> : null}
        </View>
      ) : (
        <View>
          <View style={style.body}>
            <View style={style.loadingWrp}>
              <LoadingImage />
              <Text style={typo.normal}>Đang tạo tài khoản...</Text>
            </View>
          </View>
        </View>
      )}

      <View style={s.footer}>
        {isAccountCreated ? (
          <Text style={typo.caution}>Bạn đã có tài khoản XSB.</Text>
        ) : null}
        {!isAccountCreated ? (
          <Button
            type="outline"
            title="Okie, Tạo tài toản XSB"
            disabled={loading}
            onPress={createTokenAccount}
          />
        ) : (
          <Button type="outline" title="Okie, Tiếp tục" onPress={next} />
        )}
      </View>
    </View>
  );
};
