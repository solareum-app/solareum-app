import { CryptoIcon } from '@Components/CryptoIcon';
import { LoadingImage } from '@Components/LoadingIndicator';
import { typo } from '@Components/Styles';
import { useApp } from '@Core/AppProvider/AppProvider';
import { useLocalize } from '@Core/AppProvider/LocalizeProvider';
import { usePrice } from '@Core/AppProvider/PriceProvider';
import { useToken } from '@Core/AppProvider/TokenProvider';
import { SOL_BALANCE_TARGET } from '@Screens/Airdrop/const';
import { style as s } from '@Screens/Airdrop/style';
import { PublicKey } from '@solana/web3.js';
import { wait } from '@Utils/index';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';

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

const MAX_TRY = 12;
const WAIT_TIME = 15000; // 3 mins

interface IAirdropStepCreateAccount {
  busy?: boolean;
  next?: any;
  error?: any;
}

export const AirdropStepCreateAccount = ({
  busy,
  next,
  error: submitError,
}: IAirdropStepCreateAccount) => {
  const { wallet } = useApp();
  const { loadAccountList } = useToken();
  const { accountList } = usePrice();
  const { t } = useLocalize();

  const solAccount = accountList.find((i) => i.mint === 'SOL') || {
    publicKey: '-',
    decimals: 8,
    amount: 0,
  };
  const xsbAccount = accountList.find((i) => i.symbol === 'XSB');
  let isAccountCreated = xsbAccount ? xsbAccount.publicKey : false;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mintAccountFee, setMintAccountFee] = useState<number>(0);
  const [account, setAccount] = useState(xsbAccount);

  const pollingAccount = async (no: number) => {
    if (!account) {
      setError(t('sys-error'));
      return;
    }
    if (no < 0) {
      return {};
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
      setError(t('sys-error'));
      return;
    }

    const solBalance = solAccount?.amount * Math.pow(10, solAccount?.decimals);
    if (solBalance <= SOL_BALANCE_TARGET) {
      setError(t('airdrop-sol-balance'));
      return;
    }

    setLoading(true);
    try {
      await wallet.createAssociatedTokenAccount(new PublicKey(account.address));
      const acc = await pollingAccount(MAX_TRY);
      setAccount(acc);
    } catch (err) {
      setError(t('sys-error'));
    } finally {
      setLoading(false);
      next();
    }
  };

  useEffect(() => {
    (async () => {
      const fee = await wallet.tokenAccountCost();
      setMintAccountFee(fee / Math.pow(10, solAccount.decimals));
    })();
  }, [solAccount.decimals, wallet]);

  return (
    <View style={s.main}>
      <Text style={typo.title}>{t('airdrop-title-create-xsb')}</Text>
      {!loading ? (
        <View>
          <View style={style.iconWrp}>
            <CryptoIcon uri={account?.logoURI} size={52} />
          </View>
          <Text style={typo.normal}>{t('airdrop-title-create-xsb-m01')}</Text>
          <Text style={typo.normal}>
            {t('airdrop-title-create-xsb-fee', { mintAccountFee })}
          </Text>
          {error ? <Text style={typo.caution}>{error}</Text> : null}
        </View>
      ) : (
        <View>
          <View style={style.body}>
            <View style={style.loadingWrp}>
              <LoadingImage />
              <Text style={typo.normal}>
                {t('airdrop-title-create-xsb-loading')}
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={s.footer}>
        {isAccountCreated ? (
          <Text style={typo.caution}>
            {t('airdrop-title-create-xsb-created')}
          </Text>
        ) : null}

        {submitError ? <Text style={typo.warning}>{submitError}</Text> : null}

        {!isAccountCreated ? (
          <Button
            type="outline"
            title={t('airdrop-title-create-xsb-btn')}
            disabled={loading}
            loading={busy}
            onPress={createTokenAccount}
          />
        ) : (
          <Button
            type="outline"
            title={t('airdrop-title-create-xsb-next')}
            loading={busy}
            onPress={next}
          />
        )}
      </View>
    </View>
  );
};
