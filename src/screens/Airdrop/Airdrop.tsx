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
import { useConfig } from '../../core/AppProvider/RemoteConfigProvider';

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

const checkValidAddress = async (solAddress: string, deviceId: string) => {
  if (!solAddress || !deviceId) {
    return false;
  }

  try {
    const airdropList = await authFetch(
      `/airdrops?sol_address=${solAddress}&type=airdrop`,
    );
    // since the airdrop is so big, so one device receive 1 airdrop
    // considider to disable this rules then
    const deviceList = await authFetch(
      `/airdrops?device_id=${deviceId}&type=airdrop`,
    );

    return airdropList.length <= 0 && deviceList.length <= 0;
  } catch {
    return false;
  }
};

export const Airdrop = ({ isActive }) => {
  const { accountList } = useToken();
  const [airdrop, setAirdrop] = useState(0);
  const [rewardRef, setRewardRef] = useState(0);
  const [step, setStep] = useState(AIRDROP_STEP.info);
  const [refAddress, setRefAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const metaData = useMetaData();
  const { rewardAirdrop, rewardRef: ref } = useConfig();
  const { t } = useLocalize();

  const [airdropSignature, setAirdropSignature] = useState<string>('');
  const [rewardRefSignature, setRewardRefSignature] = useState<string>('');
  const refStepInfo = useRef();

  const dismiss = () => {
    setAirdrop(0);
  };

  const startAirdrop = () => {
    setError('');
    setRefAddress('');
    setStep(AIRDROP_STEP.info);
    refStepInfo.current?.open();
  };

  const submit = async () => {
    setLoading(true);
    const solAccount = accountList.find((i) => i.mint === 'SOL');
    const xsbAccount = accountList.find((i) => i.symbol === 'XSB');

    if (!solAccount?.publicKey || !xsbAccount?.publicKey) {
      setError(t('airdrop-error-no-account'));
      setLoading(false);
      return;
    }

    try {
      const resp = await authFetch(service.postAirdrop, {
        method: 'POST',
        body: {
          solAddress: solAccount?.publicKey,
          refAddress,
          meta: {
            ...metaData,
            xsbAddress: xsbAccount?.publicKey,
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
    (async () => {
      const solAccount = accountList.find((i) => i.mint === 'SOL');
      const solAddress = solAccount?.publicKey;
      const deviceId = metaData.deviceId;

      const valid = await checkValidAddress(solAddress, deviceId);
      if (valid) {
        setAirdrop(rewardAirdrop);
        setRewardRef(ref);
      }
    })();
  }, [accountList]);

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
          title={t('airdrop-receive-btn', { airdrop })}
          type="outline"
          onPress={startAirdrop}
          disabled={airdrop === 0}
        />
      </View>

      <Portal>
        <FixedContent ref={refStepInfo}>
          {step === AIRDROP_STEP.info ? (
            <AirdropStepInfo
              dismiss={dismiss}
              next={() => setStep(AIRDROP_STEP.createAccount)}
            />
          ) : null}

          {step === AIRDROP_STEP.createAccount ? (
            <AirdropStepCreateAccount
              next={() => setStep(AIRDROP_STEP.inputRefAddress)}
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
              next={submit}
              airdrop={airdrop}
              rewardRef={rewardRef}
              refAddress={refAddress}
              loading={loading}
              error={error}
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
