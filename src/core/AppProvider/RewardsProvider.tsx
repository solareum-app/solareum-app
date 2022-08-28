import { getAdmobIdByType } from '@Components/Admob/Rewarded';
import { FixedContent } from '@Components/Modals/FixedContent';
import { MissionReward } from '@Containers/MissionButton/MissionReward';
import { useLocalize } from '@Core/AppProvider/LocalizeProvider';
import { usePrice } from '@Core/AppProvider/PriceProvider';
import { useMetaData } from '@Hooks/useMetaData';
import {
  AdEventType,
  InterstitialAd,
  RewardedAd,
  RewardedAdEventType,
  TestIds
} from '@react-native-firebase/admob';
import { AirdropStepCreateAccount } from '@Screens/Airdrop/AirdropStepCreateAccount';
import { getItem, setItem } from '@Storage/Collection';
import { authFetch } from '@Utils/authfetch';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Portal } from 'react-native-portalize';
import { service } from '../../config';

export type RewardsContextType = {
  getRewards: () => void;
  getActive: () => boolean;
  getLabel: () => string;
  loading: boolean;
  missionLeft: number;
};
export const RewardsContext = React.createContext<RewardsContextType>({
  getRewards: () => null,
  getActive: () => false,
  getLabel: () => '',
  loading: false,
  missionLeft: 0,
});

export const useRewards = () => {
  return useContext(RewardsContext);
};

const adRewardUnitId = __DEV__
  ? TestIds.REWARDED
  : getAdmobIdByType('rewarded');
const adInterUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : getAdmobIdByType('interstitial');

const MISSION_TS_KEY = 'MISSION_TS_KEY';
const BREAK_TIME = 300000; // 5 mins
const MIN_BREAK_TIME = 0; // 0

export const RewardsProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [missionReward, setMissionReward] = useState(0);
  const [missionLeft, setMissionLeft] = useState(0);
  const [mission, setMission] = useState({});
  const [isShowingAd, setIsShowingAd] = useState(false);
  const [lastMissionTs, setLastMissionTsOrg] = useState<number>(-1);

  const { accountList } = usePrice();
  const { t } = useLocalize();
  const metaData = useMetaData();

  const [currentTs, setCurrentTs] = useState(Date.now());
  const refMissionReward = useRef();
  const refCreateAccount = useRef();

  const solAccount = accountList.find((i) => i.mint === 'SOL');
  const xsbAccount = accountList.find((i) => i.symbol === 'XSB');
  let isAccountCreated = xsbAccount ? xsbAccount.publicKey : false;

  const setLastMissionTs = (value) => {
    setItem('', MISSION_TS_KEY, value);
    setLastMissionTsOrg(value);
  };

  const getRewards = async () => {
    if (missionLeft <= 0) {
      return;
    }

    if (isAccountCreated) {
      await earnMissionReward();
      setLastMissionTs(Date.now());
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

    if (missionLeft <= 0) {
      label = t('mission-label', { missionLeft });
    }

    return label;
  };

  const earnMissionReward = async () => {
    setLoading(true);
    const resp = await authFetch(service.postDistribute, {
      method: 'POST',
      body: {
        solAddress: solAccount?.publicKey,
        xsbAddress: xsbAccount?.publicKey,
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
    setMissionLeft(resp.missionLeft);
    setLoading(false);
    refMissionReward.current?.open();

    loadCheckMission();
    return 0;
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
    <RewardsContext.Provider
      value={{ getRewards, getActive, loading, getLabel, missionLeft }}
    >
      {children}
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
    </RewardsContext.Provider>
  );
};
