import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { Portal } from 'react-native-portalize';
import {
  RewardedAd,
  RewardedAdEventType,
  InterstitialAd,
  AdEventType,
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
import { setItem, getItem } from '../../storage/Collection';

const s = StyleSheet.create({
  manageBtnWrp: {
    padding: 20,
  },
  manageIcon: {
    marginRight: 10,
  },
  manageBtn: {
    borderColor: COLORS.blue4,
  },
  txtManageBtn: {
    color: COLORS.blue2,
  },
  btnDisabled: {
    borderColor: COLORS.dark4,
  },
  txtManageBtnDisabled: {
    color: COLORS.white4,
  },
});

const adRewardUnitId = __DEV__
  ? TestIds.REWARDED
  : getAdmobIdByType('rewarded');
const adInterUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : getAdmobIdByType('interstitial');

const MISSION_TS_KEY = 'MISSION_TS_KEY';
const BREAK_TIME = 300000; // 5 mins
const MIN_BREAK_TIME = 0; // 0

export const MissionButton = ({ padding = 20 }) => {
  const [loading, setLoading] = useState(false);
  const [missionReward, setMissionReward] = useState(0);
  const [missionLeft, setMissionLeft] = useState(0);
  const [mission, setMission] = useState({});
  const [isShowingAd, setIsShowingAd] = useState(false);
  const [done, setDone] = useState(false);
  const [lastMissionTs, setLastMissionTsOrg] = useState<number>(-1);

  const { accountList } = useToken();
  const { t } = useLocalize();

  const [currentTs, setCurrentTs] = useState(Date.now());
  const metaData = useMetaData();
  const refMissionReward = useRef();
  const refCreateAccount = useRef();

  const solAccount = accountList.find((i) => i.mint === 'SOL');
  const xsbAccount = accountList.find((i) => i.symbol === 'XSB');
  let isAccountCreated = xsbAccount ? xsbAccount.publicKey : false;

  const setLastMissionTs = (value) => {
    setItem('', MISSION_TS_KEY, value);
    setLastMissionTsOrg(value);
  };

  const checkInitialCondition = () => {
    if (isAccountCreated) {
      showRewardAd();
    } else {
      refCreateAccount.current?.open();
    }
  };

  const getWaitingTime = () => {
    const delta = currentTs - lastMissionTs;
    if (delta > BREAK_TIME) {
      return 0;
    }
    const waitingTime = Math.round(Math.abs((BREAK_TIME - delta) / 1000));
    return waitingTime;
  };

  const getActive = () => {
    const waitingTime = getWaitingTime();
    const isActive = waitingTime <= 0 && missionLeft > 0;
    return isActive && !isShowingAd;
  };

  const getLabel = () => {
    const waitingTime = getWaitingTime();
    const isActive = getActive();

    let label = t('mission-wait-label', {
      second: waitingTime,
    });

    if (isActive) {
      label = t('mission-active-label', { amount: missionReward });
    }

    if (missionLeft <= 0 || done) {
      label = t('mission-label', { missionLeft });
    }

    return label;
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
    setDone(true);
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
    setMissionReward(resp.missionReward);
  };

  const showRewardAd = async () => {
    setLoading(true);
    // Create a new instance
    const rewardAd = RewardedAd.createForAdRequest(adRewardUnitId);
    // Add event handlers
    rewardAd.onAdEvent(async (type: any, error: any) => {
      if (error) {
        setLoading(false);
        showInterAd();
      }

      if (type === RewardedAdEventType.LOADED) {
        setIsShowingAd(true);
        setLoading(false);
        rewardAd.show();
      }

      if (type === RewardedAdEventType.EARNED_REWARD) {
        await earnMissionReward();
        await loadCheckMission();
        setIsShowingAd(false);
        setLastMissionTs(Date.now());
      }
    });
    // Load a new advert
    rewardAd.load();
  };

  const showInterAd = async () => {
    setLoading(true);
    // Create a new instance
    const interAd = InterstitialAd.createForAdRequest(adInterUnitId);

    // Add event handlers
    interAd.onAdEvent(async (type: any, error: any) => {
      if (error) {
        setLoading(false);
      }

      if (type === AdEventType.LOADED) {
        setLoading(false);
        setIsShowingAd(true);
        interAd.show();
      }

      if (type === AdEventType.CLOSED) {
        await earnMissionReward();
        await loadCheckMission();
        setIsShowingAd(false);
        setLastMissionTs(Date.now());
      }
    });
    // Load a new advert
    interAd.load();
  };

  useEffect(() => {
    loadCheckMission();
  }, [accountList]);

  useEffect(() => {
    setLastMissionTsOrg(Date.now());

    let lastMissionInterval = setInterval(() => {
      setCurrentTs(Date.now());
    }, 1000);

    (async () => {
      const missionTsStr = await getItem('', MISSION_TS_KEY);
      const missionTs = parseInt(missionTsStr, 10);
      if (missionTsStr) {
        const delta = currentTs - missionTs;
        const waitingTime = BREAK_TIME - delta;
        // to make sure that user have to wait at least MIN_BREAK_TIME
        if (waitingTime < MIN_BREAK_TIME) {
          setLastMissionTs(Date.now() - BREAK_TIME + MIN_BREAK_TIME);
        } else {
          setLastMissionTs(missionTs);
        }
      } else {
        setLastMissionTs(Date.now());
      }
    })();

    return () => {
      clearInterval(lastMissionInterval);
    };
  }, []);

  return (
    <View style={{ ...s.manageBtnWrp, padding }}>
      <Button
        title={getLabel()}
        type="outline"
        loading={loading}
        disabled={!getActive()}
        onPress={checkInitialCondition}
        buttonStyle={s.manageBtn}
        titleStyle={s.txtManageBtn}
        disabledStyle={s.btnDisabled}
        disabledTitleStyle={s.txtManageBtnDisabled}
        icon={
          <Icon
            size={16}
            style={s.manageIcon}
            color={getActive() ? COLORS.blue2 : COLORS.white4}
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
