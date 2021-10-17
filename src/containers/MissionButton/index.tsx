import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { Portal } from 'react-native-portalize';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from '@react-native-firebase/admob';

import { FixedContent } from '../../components/Modals/FixedContent';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';
import { authFetch } from '../../utils/authfetch';
import { service } from '../../config';
import { useMetaData } from '../../hooks/useMetaData';
import { useToken } from '../../core/AppProvider/TokenProvider';

import { getAdmobIdByType } from '../../components/Admob/Rewarded';
import { COLORS } from '../../theme';
import { MissionReward } from './MissionReward';

const s = StyleSheet.create({
  manageBtnWrp: {
    padding: 20,
  },
  manageBtn: {
    borderColor: COLORS.dark4,
  },
  manageIcon: {
    marginRight: 10,
  },
  txtManageBtn: {
    color: COLORS.white2,
  },
});

const adRewardUnitId = __DEV__
  ? TestIds.REWARDED
  : getAdmobIdByType('rewarded');

export const MissionButton = ({ padding = 20 }) => {
  const [loading, setLoading] = useState(false);
  const [missionLeft, setMissionLeft] = useState(0);
  const [mission, setMission] = useState({});
  const { accountList } = useToken();
  const { t } = useLocalize();
  const metaData = useMetaData();
  const refMissionReward = useRef();

  const solAccount = accountList.find((i) => i.mint === 'SOL');

  const earnMissionReward = async () => {
    const resp = await authFetch(service.postMission, {
      method: 'POST',
      body: {
        solAddress: solAccount?.publicKey,
        meta: {
          ...metaData,
        },
      },
    });
    setMission(resp);
    refMissionReward.current?.open();
  };

  const loadCheckMission = async () => {
    const resp = await authFetch(service.postCheckMission, {
      method: 'POST',
      body: {
        solAddress: solAccount?.publicKey,
        meta: {
          ...metaData,
        },
      },
    });
    setMissionLeft(resp.missionLeft);
  };

  const showRewardAd = async () => {
    setLoading(true);
    // Create a new instance
    const rewardAd = RewardedAd.createForAdRequest(adRewardUnitId);
    // Add event handlers
    rewardAd.onAdEvent(async (type: any, error: any) => {
      if (error) {
        setLoading(false);
      }

      if (type === RewardedAdEventType.LOADED) {
        rewardAd.show();
        setLoading(false);
      }

      if (type === RewardedAdEventType.EARNED_REWARD) {
        await earnMissionReward();
        await loadCheckMission();
        // User earned reward of 5 lives
        // TODO: send XSB token to user's address
      }
    });
    // Load a new advert
    rewardAd.load();
  };

  useEffect(() => {
    loadCheckMission();
  }, [accountList]);

  return (
    <View style={{ ...s.manageBtnWrp, padding }}>
      <Button
        title={t('mission-label', { missionLeft })}
        onPress={showRewardAd}
        type="outline"
        loading={loading}
        disabled={missionLeft === 0}
        buttonStyle={s.manageBtn}
        titleStyle={s.txtManageBtn}
        icon={
          <Icon
            size={16}
            style={s.manageIcon}
            color={COLORS.white2}
            name="zap"
            type="feather"
          />
        }
      />

      <Portal>
        <FixedContent ref={refMissionReward}>
          <MissionReward mission={mission} />
        </FixedContent>
      </Portal>
    </View>
  );
};
