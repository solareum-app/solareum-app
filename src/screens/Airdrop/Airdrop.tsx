import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { Portal } from 'react-native-portalize';

import { FixedContent } from '../../components/Modals/FixedContent';
import { COLORS } from '../../theme';
import Icon from '../../components/Icon';
import { AirdropStepInfo } from './AirdropStepInfo';
import { AirdropStepCreateAccount } from './AirdropStepCreateAccount';
import { AirdropStepInputRefAddress } from './AirdropStepInputRefAddress';
import { AirdropStepReview } from './AirdropStepReview';
import { AirdropStepSuccessAndShare } from './AirdropStepSuccessAndShare';

const s = StyleSheet.create({
  root: {
    padding: 8,
    marginTop: -36,
    marginBottom: 40,
  },
  main: {
    borderRadius: 16,
    padding: 0,
    borderColor: COLORS.dark4,
    borderWidth: 0.5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  imgWrp: {
    flex: 0,
  },
  img: {
    width: 100,
    height: 100,
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
  const refStepInfo = useRef();

  const dismiss = () => {
    setAirdrop(false);
  };

  if (!airdrop) {
    return null;
  }

  return (
    <View>
      <TouchableOpacity
        style={s.root}
        onPress={() => refStepInfo.current?.open()}
      >
        <View style={s.main}>
          <View style={s.imgWrp}>
            <LottieView
              autoPlay
              loop
              source={require('../../theme/lottie/award-badge.json')}
              style={s.img}
            />
          </View>
          <Text style={s.message}>Nhận XSB Airdrop</Text>
          <Icon type="feather" name="chevron-right" color={COLORS.white4} />
        </View>
      </TouchableOpacity>

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
            />
          ) : null}

          {step === AIRDROP_STEP.review ? (
            <AirdropStepReview
              next={() => setStep(AIRDROP_STEP.successAndShare)}
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
