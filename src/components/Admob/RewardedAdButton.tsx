import React from 'react';

import { Button } from 'react-native';

import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from '@react-native-firebase/admob';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-8137455675462743/3496078333';

const RewardedAdButton: React.FC<Props> = () => {
  const showRewardAd = () => {
    // Create a new instance
    const rewardAd = RewardedAd.createForAdRequest(adUnitId);
    // Add event handlers
    rewardAd.onAdEvent((type: any, _error: any) => {
      if (type === RewardedAdEventType.LOADED) {
        rewardAd.show();
      }
      if (type === RewardedAdEventType.EARNED_REWARD) {
        console.log('User earned reward of 5 lives');
      }
    });
    // Load a new advert
    rewardAd.load();
  };

  return <Button title="Show Ad" onPress={showRewardAd} />;
};

export default RewardedAdButton;
