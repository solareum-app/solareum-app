import React from 'react';

import { Button, View, StyleSheet } from 'react-native';

import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
  BannerAd,
  BannerAdSize,
} from '@react-native-firebase/admob';

const adRewardUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-8137455675462743/3496078333';

const adBannerUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-8137455675462743/9853888538';

type Props = {
  disabled?: boolean;
};

const s = StyleSheet.create({
  main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const Banner = () => {
  return (
    <View style={s.main}>
      <BannerAd size={BannerAdSize.LARGE_BANNER} unitId={adBannerUnitId} />
    </View>
  );
};

export const Rewarded: React.FC<Props> = ({ disabled }) => {
  const showRewardAd = () => {
    // Create a new instance
    const rewardAd = RewardedAd.createForAdRequest(adRewardUnitId);
    // Add event handlers
    rewardAd.onAdEvent((type: any, _error: any) => {
      if (type === RewardedAdEventType.LOADED) {
        rewardAd.show();
      }
      if (type === RewardedAdEventType.EARNED_REWARD) {
        // User earned reward of 5 lives
        // TODO: send XSB token to user's address
      }
    });
    // Load a new advert
    rewardAd.load();
  };

  return (
    <Button title="Làm nhiệm vụ" onPress={showRewardAd} disabled={disabled} />
  );
};

export default Rewarded;
