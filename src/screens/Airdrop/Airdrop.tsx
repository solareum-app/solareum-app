import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Portal } from 'react-native-portalize';
import { Button } from 'react-native-elements';

import { useToken } from '../../core/AppProvider/TokenProvider';
import { FixedContent } from '../../components/Modals/FixedContent';
import { COLORS } from '../../theme';
import { typo } from '../../components/Styles';
import { AirdropStepInfo } from './AirdropStepInfo';
import { AirdropStepCreateAccount } from './AirdropStepCreateAccount';
import { AirdropStepInputRefAddress } from './AirdropStepInputRefAddress';
import { AirdropStepReview } from './AirdropStepReview';
import { AirdropStepSuccessAndShare } from './AirdropStepSuccessAndShare';
import ImgPayment from '../../assets/clip-payment.png';
import { authFetch } from '../../utils/authfetch';
import { service } from '../../config';
import { useMetaData } from '../../hooks/useMetaData';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';
import { SOL_BALANCE_TARGET } from './const';

const s = StyleSheet.create({
  main: {
    marginTop: -36,
    marginBottom: 40,
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
});

enum AIRDROP_STEP {
  info = 'info',
  createAccount = 'createAccount',
  inputRefAddress = 'inputRefAddress',
  review = 'review',
  successAndShare = 'successAndShare',
}

export const Airdrop = ({ isActive, load }) => {
  const { accountList } = useToken();
  const [airdrop, setAirdrop] = useState(0);
  const [rewardRef, setRewardRef] = useState(0);
  const [step, setStep] = useState(AIRDROP_STEP.info);
  const [refAddress, setRefAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const metaData = useMetaData();
  const { t } = useLocalize();

  const [airdropSignature, setAirdropSignature] = useState<string>('');
  const [rewardRefSignature, setRewardRefSignature] = useState<string>('');
  const refStepInfo = useRef();

  const solAccount = accountList.find((i) => i.mint === 'SOL') || {
    publicKey: '-',
    decimals: 8,
    amount: 0,
  };
  const solAddress = solAccount?.publicKey;

  const checkBalance = () => {
    const solBalance = solAccount?.amount * Math.pow(10, solAccount?.decimals);

    if (solBalance <= SOL_BALANCE_TARGET) {
      setError(t('airdrop-sol-balance'));
      return;
    }

    setError('');
    setStep(AIRDROP_STEP.inputRefAddress);
  };

  const checkAirdrop = async () => {
    if (!solAddress || airdrop < 0) {
      return;
    }

    const resp = await authFetch(service.postCheckAirdrop, {
      method: 'POST',
      body: {
        solAddress,
        meta: {
          ...metaData,
        },
      },
    });

    setAirdrop(resp.rewardAirdrop || 0);
    setRewardRef(resp.rewardRef || 0);
  };

  const dismiss = () => {
    setAirdrop(-1);
  };

  const startAirdrop = () => {
    setError('');
    setRefAddress('');
    setStep(AIRDROP_STEP.info);
    refStepInfo.current?.open();
  };

  const registerWallet = async () => {
    setLoading(true);
    const solAccount = accountList.find((i) => i.mint === 'SOL');

    if (!solAccount?.publicKey) {
      setError(t('airdrop-error-no-account'));
      setLoading(false);
      return;
    }

    try {
      await authFetch(service.postWalletNew, {
        method: 'POST',
        body: {
          solAddress: solAccount?.publicKey,
          refAddress,
          meta: {
            ...metaData,
          },
        },
      });
    } catch {
    } finally {
      setLoading(false);
      setAirdrop(-1);
      setStep(AIRDROP_STEP.createAccount);
    }
  };

  const submit = async () => {
    setLoading(true);
    const solAccount = accountList.find((i) => i.mint === 'SOL');

    if (!solAccount?.publicKey) {
      setError(t('airdrop-error-no-account'));
      setLoading(false);
      return;
    }

    try {
      const resp = await authFetch(service.postAirdrop, {
        method: 'POST',
        body: {
          solAddress: solAccount?.publicKey,
          meta: {
            ...metaData,
          },
        },
      });
      if (resp.status > 0) {
        setAirdrop(resp.rewardAirdrop);
        setRewardRef(resp.rewardRef);
        setAirdropSignature(resp.rewardAirdropSignature);
        setRewardRefSignature(resp.rewardRefSignature);
        setStep(AIRDROP_STEP.successAndShare);
      } else {
        setError(resp.error);
      }
    } catch (err) {
      setError(t('sys-error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAirdrop();
  }, [load, accountList]);

  if (!airdrop && !isActive) {
    return null;
  }

  return (
    <View>
      <View style={{ ...s.main, padding: isActive ? 0 : 24 }}>
        <Image style={s.img} source={ImgPayment} />
        <Text style={typo.titleLeft}>{t('airdrop-title')}</Text>
        <Text style={typo.normal}>{t('airdrop-intro')}</Text>
        <Button
          title={t('airdrop-receive-btn', {
            airdrop: airdrop > 0 ? airdrop : 0,
          })}
          type="outline"
          onPress={startAirdrop}
          disabled={airdrop <= 0}
        />
      </View>

      <Portal>
        <FixedContent ref={refStepInfo}>
          {step === AIRDROP_STEP.info ? (
            <AirdropStepInfo
              dismiss={dismiss}
              next={checkBalance}
              error={error}
            />
          ) : null}

          {step === AIRDROP_STEP.inputRefAddress ? (
            <AirdropStepInputRefAddress
              next={() => setStep(AIRDROP_STEP.review)}
              refAddress={refAddress}
              setRefAddress={setRefAddress}
            />
          ) : null}

          {step === AIRDROP_STEP.review ? (
            <AirdropStepReview
              next={registerWallet}
              airdrop={airdrop}
              rewardRef={rewardRef}
              refAddress={refAddress}
              loading={loading}
              error={error}
            />
          ) : null}

          {step === AIRDROP_STEP.createAccount ? (
            <AirdropStepCreateAccount
              busy={loading}
              error={error}
              next={async () => {
                await submit();
                setStep(AIRDROP_STEP.successAndShare);
              }}
            />
          ) : null}

          {step === AIRDROP_STEP.successAndShare ? (
            <AirdropStepSuccessAndShare
              next={dismiss}
              airdrop={airdrop}
              rewardRef={rewardRef}
              airdropSignature={airdropSignature}
              rewardRefSignature={rewardRefSignature}
            />
          ) : null}
        </FixedContent>
      </Portal>
    </View>
  );
};
