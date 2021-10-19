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
import { AirdropStepCreateAccount } from '../../screens/Airdrop/AirdropStepCreateAccount';

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
  btnDisabled: {
    opacity: 0.25,
    borderColor: COLORS.dark4,
  },
  txtManageBtn: {
    color: COLORS.white2,
  },
});

const adRewardUnitId = __DEV__
  ? TestIds.REWARDED
  : getAdmobIdByType('rewarded');

const BREAK_TIME = 45000; // 45s
let lastMissionTs = 0;

export const MissionButton = ({ padding = 20 }) => {
  const [loading, setLoading] = useState(false);
  const [missionLeft, setMissionLeft] = useState(0);
  const [mission, setMission] = useState({});
  const { accountList } = useToken();
  const { t } = useLocalize();
  const [currentTs, setCurrentTs] = useState(Date.now());
  const metaData = useMetaData();
  const refMissionReward = useRef();
  const refCreateAccount = useRef();

  const solAccount = accountList.find((i) => i.mint === 'SOL');
  const xsbAccount = accountList.find((i) => i.symbol === 'XSB');
  let isAccountCreated = xsbAccount ? xsbAccount.publicKey : false;

  const checkInitialCondition = () => {
    if (isAccountCreated) {
      showRewardAd();
    } else {
      refCreateAccount.current?.open();
    }
  };

  const earnMissionReward = async () => {
    const resp = await authFetch(service.postMission, {
      method: 'POST',
      body: {
        solAddress: solAccount?.publicKey,
        meta: {
          ...metaData,
        },
      },
    }).catch(() => {
      return {
        missionReward: 0,
        missionSignature: '',
        missionRewardError: 'Plz wait for an hour an try again.',
      };
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
        lastMissionTs = Date.now();
      }
    });
    // Load a new advert
    rewardAd.load();
  };

  useEffect(() => {
    loadCheckMission();
  }, [accountList]);

  useEffect(() => {
    if (missionLeft === 0) {
      return;
    }

    let lastMissionInterval = setInterval(() => {
      setCurrentTs(Date.now());
    }, 1000);

    return () => {
      clearInterval(lastMissionInterval);
    };
  }, [missionLeft]);

  const delta = currentTs - lastMissionTs;
  const isActive = delta > BREAK_TIME && missionLeft > 0;

  const getLabel = () => {
    const waitingTime = Math.round(Math.abs((BREAK_TIME - delta) / 1000));
    let label = '';

    if (isActive) {
      label = t('mission-label', { missionLeft });
    } else {
      label = t('mission-wait-label', { second: waitingTime });
    }
    if (missionLeft === 0) {
      label = t('mission-label', { missionLeft });
    }

    return label;
  };

  return (
    <View style={{ ...s.manageBtnWrp, padding }}>
      <Button
        title={getLabel()}
        onPress={checkInitialCondition}
        type="outline"
        loading={loading}
        disabled={!isActive}
        buttonStyle={s.manageBtn}
        titleStyle={s.txtManageBtn}
        disabledStyle={s.btnDisabled}
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
        <FixedContent ref={refCreateAccount}>
          <AirdropStepCreateAccount
            next={() => {
              refCreateAccount.current?.close();
              showRewardAd();
            }}
          />
        </FixedContent>
      </Portal>
    </View>
  );
};
