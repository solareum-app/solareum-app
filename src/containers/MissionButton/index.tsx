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
  manageIcon: {
    marginRight: 10,
  },
  manageBtn: {
    borderColor: COLORS.dark4,
  },
  btnDisabled: {
    borderColor: COLORS.dark4,
  },
  txtManageBtn: {
    color: COLORS.blue2,
  },
  txtManageBtnDisabled: {
    color: COLORS.blue0,
  },
});

const adRewardUnitId = __DEV__
  ? TestIds.REWARDED
  : getAdmobIdByType('rewarded');

const BREAK_TIME = 60000; // 60s
let lastMissionTs = Date.now();

export const MissionButton = ({ padding = 20 }) => {
  const [loading, setLoading] = useState(false);
  const [missionLeft, setMissionLeft] = useState(0);
  const [mission, setMission] = useState({});
  const [isShowingAd, setIsShowingAd] = useState(false);
  const { accountList } = useToken();
  const { t } = useLocalize();
  const [currentTs, setCurrentTs] = useState(Date.now());
  const metaData = useMetaData();
  const refMissionReward = useRef();
  const refCreateAccount = useRef();
  const [number, setNumber] = useState(1);

  const solAccount = accountList.find((i) => i.mint === 'SOL');
  const xsbAccount = accountList.find((i) => i.symbol === 'XSB');
  let isAccountCreated = xsbAccount ? xsbAccount.publicKey : false;

  const checkInitialCondition = () => {
    if (isAccountCreated) {
      setIsShowingAd(true);
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
        setIsShowingAd(false);
      }

      if (type === RewardedAdEventType.LOADED) {
        rewardAd.show();
        setLoading(false);
      }

      if (type === RewardedAdEventType.EARNED_REWARD) {
        await earnMissionReward();
        await loadCheckMission();
        setIsShowingAd(false);
        setNumber(number + 1);
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

  useEffect(() => {
    const delta = currentTs - lastMissionTs;
    const isActive = delta > BREAK_TIME * number && missionLeft > 0;
    if (isActive && !isShowingAd) {
      checkInitialCondition();
    }
  }, [currentTs]);

  useEffect(() => {
    lastMissionTs = Date.now();
  }, []);

  const getLabel = () => {
    const delta = currentTs - lastMissionTs;
    const waitingTime = Math.round(
      Math.abs((BREAK_TIME * number - delta) / 1000),
    );
    let label = '';

    label = t('mission-wait-label', { second: waitingTime });

    if (missionLeft <= 0) {
      label = t('mission-label', { missionLeft });
    }

    return label;
  };

  return (
    <View style={{ ...s.manageBtnWrp, padding }}>
      <Button
        title={getLabel()}
        type="outline"
        loading={loading}
        disabled={true}
        buttonStyle={s.manageBtn}
        titleStyle={s.txtManageBtn}
        disabledStyle={s.btnDisabled}
        disabledTitleStyle={s.txtManageBtnDisabled}
        icon={
          <Icon
            size={16}
            style={s.manageIcon}
            color={COLORS.blue2}
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
