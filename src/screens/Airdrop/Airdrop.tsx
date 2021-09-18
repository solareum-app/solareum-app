import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Portal } from 'react-native-portalize';
import { Button } from 'react-native-elements';

import { FixedContent } from '../../components/Modals/FixedContent';
import { COLORS } from '../../theme';
import { typo } from '../../components/Styles';
import { AirdropStepInfo } from './AirdropStepInfo';
import { AirdropStepCreateAccount } from './AirdropStepCreateAccount';
import { AirdropStepInputRefAddress } from './AirdropStepInputRefAddress';
import { AirdropStepReview } from './AirdropStepReview';
import { AirdropStepSuccessAndShare } from './AirdropStepSuccessAndShare';
import ImgPayment from '../../assets/clip-payment.png';

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
  const [airdrop, setAirdrop] = useState(true);
  const [step, setStep] = useState(AIRDROP_STEP.info);
  const [refAddress, setRefAddress] = useState('');
  const refStepInfo = useRef();

  const dismiss = () => {
    setAirdrop(false);
  };

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
        <Button
          title="Nhận XSB"
          type="outline"
          onPress={() => {
            setStep(AIRDROP_STEP.info);
            refStepInfo.current?.open();
          }}
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
              next={() => setStep(AIRDROP_STEP.successAndShare)}
              refAddress={refAddress}
            />
          ) : null}

          {step === AIRDROP_STEP.successAndShare ? (
            <AirdropStepSuccessAndShare next={dismiss} />
          ) : null}
        </FixedContent>
      </Portal>
    </View>
  );
};
