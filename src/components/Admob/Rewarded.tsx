import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Button } from 'react-native-elements';

import {
  RewardedAd,
  RewardedAdEventType,
  BannerAd,
  BannerAdSize,
  TestIds,
} from '@react-native-firebase/admob';

export type AdmobType = {
  banner: 'banner';
  rewarded: 'rewarded';
};

export const ADMOB = {
  android: {
    banner: 'ca-app-pub-8137455675462743/9853888538',
    rewarded: 'ca-app-pub-8137455675462743/3496078333',
  },
  ios: {
    banner: 'ca-app-pub-8137455675462743/7952970731',
    rewarded: 'ca-app-pub-8137455675462743/1659025128',
  },
};

export const getAdmobIdByType = (type: string): string => {
  const item = Platform.OS === 'ios' ? ADMOB.ios : ADMOB.android;
  return item[type] || TestIds.BANNER;
};

const adRewardUnitId = __DEV__
  ? TestIds.REWARDED
  : getAdmobIdByType('rewarded');

const adBannerUnitId = __DEV__ ? TestIds.BANNER : getAdmobIdByType('banner');

type Props = {
  disabled?: boolean;
};

const s = StyleSheet.create({
  main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
});

export const Banner = () => {
  return (
    <View style={s.main}>
      <BannerAd size={BannerAdSize.MEDIUM_RECTANGLE} unitId={adBannerUnitId} />
    </View>
  );
};

export const Rewarded: React.FC<Props> = ({ disabled }) => {
  const [loading, setLoading] = useState(false);

  const showRewardAd = () => {
    setLoading(true);
    // Create a new instance
    const rewardAd = RewardedAd.createForAdRequest(adRewardUnitId);
    // Add event handlers
    rewardAd.onAdEvent((type: any, error: any) => {
      if (error) {
        setLoading(false);
      }

      if (type === RewardedAdEventType.LOADED) {
        rewardAd.show();
        setLoading(false);
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
    <Button
      title="Làm nhiệm vụ"
      disabled={disabled}
      onPress={showRewardAd}
      type="outline"
      loading={loading}
    />
  );
};

export default Rewarded;
