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

export const Airdrop = () => {
  const { accountList } = useToken();
  const [airdrop, setAirdrop] = useState(false);
  const [rewardRef, setRewardRef] = useState(0);
  const [step, setStep] = useState(AIRDROP_STEP.info);
  const [refAddress, setRefAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const [airdropSignature, setAirdropSignature] = useState<string>('');
  const [rewardRefSignature, setRewardRefSignature] = useState<string>('');
  const refStepInfo = useRef();

  const dismiss = () => {
    setAirdrop(false);
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
      setError(
        'Tài khoản XSB chưa được khởi tạo, bạn chưa thể hoàn thành airdrop.',
      );
      setLoading(false);
      return;
    }

    try {
      const resp = await authFetch(service.postAirdrop, {
        method: 'POST',
        body: {
          solAddress: solAccount?.publicKey,
          xsbAddress: xsbAccount?.publicKey,
          refAddress,
        },
      });
      setAirdrop(resp.rewardAirdrop);
      setRewardRef(resp.rewardRef);
      setAirdropSignature(resp.rewardAirdropSignature);
      setRewardRefSignature(resp.rewardRefSignature);
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setStep(AIRDROP_STEP.successAndShare);
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const solAccount = accountList.find((i) => i.mint === 'SOL');
      const xsbAccount = accountList.find((i) => i.symbol === 'XSB');
      const t = await authFetch(service.postCheckAirdrop, {
        method: 'POST',
        body: {
          solAddress: solAccount?.publicKey,
          xsbAddress: xsbAccount?.publicKey,
        },
      });
      setAirdrop(t.rewardAirdrop);
      setRewardRef(t.rewardRef);
    })();
  }, []);

  if (!airdrop) {
    return null;
  }

  return (
    <View>
      <View style={s.main}>
        <Image style={s.img} source={ImgPayment} />
        <Text style={typo.titleLeft}>XSB Airdrop</Text>
        <Text style={typo.normal}>
          XSB là token sẽ được sử dụng trong Solareum Lightning, một ứng dụng
          web3.0 giúp thưởng cho những nhà phát triển nội dung kỹ thuật số.
        </Text>
        <Button title="Nhận +20 XSB" type="outline" onPress={startAirdrop} />
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