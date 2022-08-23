import React, { useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { Portal } from 'react-native-portalize';
import ImgPayment from '../../assets/clip-1.png';
import { LoadingImage } from '../../components/LoadingIndicator';
import { FixedContent } from '../../components/Modals/FixedContent';
import { typo } from '../../components/Styles';
import { service } from '../../config';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';
import { usePrice } from '../../core/AppProvider/PriceProvider';
import { useConfig } from '../../core/AppProvider/RemoteConfigProvider';
import { useMetaData } from '../../hooks/useMetaData';
import { AirdropStepCreateAccount } from '../../screens/Airdrop/AirdropStepCreateAccount';
import { COLORS } from '../../theme';
import { wait } from '../../utils';
import { authFetch } from '../../utils/authfetch';
import { ReceiveMessage } from './ReceiveMessage';
import { TokenSaleForm } from './TokenSaleForm';
import { TokenSaleStepInfo } from './TokenSaleStepInfo';

const s = StyleSheet.create({
  main: {
    marginTop: -36,
    padding: 24,
  },
  img: {
    width: 140,
    height: 140,
  },
  message: {
    fontSize: 16,
    color: COLORS.white4,
    marginBottom: 0,
    flex: 1,
  },
  bodyWrp: {
    minHeight: 400,
  },
  loadingWrp: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 240,
  },
});

enum TOKEN_SALE_STEP {
  info = 'info',
  createAccount = 'createAccount',
  form = 'form',
  distributing = 'distributing',
  successAndShare = 'successAndShare',
}

const MAX_TRY = 8;
const WAIT_TIME = 15000; // 3 mins

export const TokenSaleButton = () => {
  const { accountList } = usePrice();
  const [step, setStep] = useState(TOKEN_SALE_STEP.info);
  const [purchase, setPurchase] = useState({});
  const [error, setError] = useState<string>('');
  const metaData = useMetaData();
  const { t } = useLocalize();
  const { presale } = useConfig();
  const refTokenSale = useRef<any>();

  const emtpyAccount = { publicKey: '-', decimals: 8, amount: 0 };
  const usdcMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

  const solAccount = accountList.find((i) => i.mint === 'SOL') || emtpyAccount;
  const xsbAccount =
    accountList.find((i) => i.symbol === 'XSB') || emtpyAccount;
  const usdcAccountList = accountList
    .filter((i) => i.mint === usdcMint)
    .sort((a, b) => b.amount - a.amount);

  const usdcAccount = usdcAccountList.length
    ? usdcAccountList[0]
    : emtpyAccount;
  const solAddress = solAccount?.publicKey;
  const isAccountCreated = xsbAccount ? xsbAccount?.publicKey : false;

  const getStarted = () => {
    setError('');
    setStep(TOKEN_SALE_STEP.info);
    refTokenSale.current?.open();
  };

  const checkAccountAndNext = () => {
    if (!usdcAccount.amount) {
      setError(
        'Your USDC balance should be positive, plz deposit USDC to continue.',
      );
      return;
    }

    if (!isAccountCreated) {
      setStep(TOKEN_SALE_STEP.createAccount);
      return;
    }
    setStep(TOKEN_SALE_STEP.form);
  };

  const pollingDistribution = async (no: number, tx: string) => {
    if (no < 0) {
      return { status: -1 };
    }

    const purchase = await authFetch(service.purchaseDistribute, {
      method: 'POST',
      body: {
        tx,
      },
    }).catch(() => {
      return { status: -1 };
    });

    if (purchase.status < 0) {
      await wait(WAIT_TIME);
      return pollingDistribution(no - 1, tx);
    }

    return purchase;
  };

  const submit = async (payload) => {
    setStep(TOKEN_SALE_STEP.distributing);

    const p = await authFetch(service.purchaseSubmit, {
      method: 'POST',
      body: {
        solAddress,
        signature: payload.signature,
        meta: {
          ...metaData,
          ...payload,
        },
      },
    }).catch(() => {
      setError('Server error, plz contact our admin for more information.');
      return null;
    });

    if (p) {
      const r = await pollingDistribution(MAX_TRY, payload.signature);
      if (r.status < 0) {
        setError('Server error, plz contact our admin for more information.');
        return;
      }
      setPurchase({
        qty: r.xsbAmount,
        signature: r.releaseSignature,
      });
    }

    setStep(TOKEN_SALE_STEP.successAndShare);
  };

  if (!presale.active) {
    return null;
  }

  return (
    <View>
      <View style={{ ...s.main, padding: 24 }}>
        <Image style={s.img} source={ImgPayment} />
        <Text style={typo.titleLeft}>XSB Token Sales</Text>
        <Text style={typo.normal}>{t('airdrop-intro')}</Text>
        <Button
          type="outline"
          onPress={getStarted}
          disabled={false}
          title="Buy"
        />
      </View>

      <Portal>
        <FixedContent ref={refTokenSale}>
          {step === TOKEN_SALE_STEP.info ? (
            <TokenSaleStepInfo
              presale={presale}
              error={error}
              next={() => {
                checkAccountAndNext();
              }}
              dismiss={() => {
                refTokenSale.current?.close();
              }}
            />
          ) : null}

          {step === TOKEN_SALE_STEP.createAccount ? (
            <AirdropStepCreateAccount
              error={error}
              next={async () => {
                setStep(TOKEN_SALE_STEP.form);
              }}
            />
          ) : null}

          {step === TOKEN_SALE_STEP.form ? (
            <TokenSaleForm
              presale={presale}
              token={usdcAccount}
              next={submit}
            />
          ) : null}

          {step === TOKEN_SALE_STEP.distributing ? (
            <View style={s.bodyWrp}>
              <View style={s.loadingWrp}>
                <LoadingImage />
                <Text style={typo.normal}>All set! Your XSB is coming...</Text>
                {error ? <Text style={typo.warning}>{error}</Text> : null}
              </View>
            </View>
          ) : null}

          {step === TOKEN_SALE_STEP.successAndShare ? (
            <ReceiveMessage purchase={purchase} />
          ) : null}
        </FixedContent>
      </Portal>
    </View>
  );
};
