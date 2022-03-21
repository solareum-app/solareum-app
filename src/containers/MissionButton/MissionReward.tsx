import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Linking, Share } from 'react-native';
import { Button } from 'react-native-elements';
import LottieView from 'lottie-react-native';

import { grid, typo } from '../../components/Styles';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';
import { COLORS } from '../../theme';
import { authFetch } from '../../utils/authfetch';
import { usePrice } from '../../core/AppProvider/PriceProvider';

const style = StyleSheet.create({
  main: {
    padding: 20,
    ...grid.popover,
  },
  imgWrp: {
    width: 120,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  img: {
    width: 120,
    height: 120,
  },

  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    marginBottom: 20,
    marginTop: -10,
  },
  rowItem: {
    flex: 1,
  },
  rowItemRight: {
    flex: 0,
  },
  value: {
    lineHeight: 40,
    color: COLORS.white2,
    fontSize: 20,
  },
});

const FULL_AIRDROP = 40;

export const MissionReward = ({ mission }) => {
  const { t } = useLocalize();
  const { accountList } = usePrice();

  const [total, setTotal] = useState<number>(0);
  const solAccount = accountList.find((i) => i.mint === 'SOL');

  const missionReward = mission.missionReward;
  const missionSignature = mission.missionRewardSignature;
  const missionRewardError = mission.missionRewardError;

  const onShare = async () => {
    try {
      const message = t('airdrop-final-share', {
        address: solAccount?.publicKey,
      });

      const result = await Share.share({
        message,
      });
      return result;
    } catch {}
  };

  useEffect(() => {
    (async () => {
      const resp = await authFetch(
        `https://api.solareum.app/airdrops/count?sol_address=${solAccount.publicKey}&type=mission`,
        {
          method: 'GET',
        },
      );
      setTotal(resp);
    })();
  }, []);

  return (
    <View style={style.main}>
      <Text style={typo.title}>{t('mission-modal-title')}</Text>
      <View style={style.imgWrp}>
        <LottieView
          autoPlay
          loop
          source={require('../../theme/lottie/award-badge.json')}
          style={style.img}
        />
      </View>

      {total < FULL_AIRDROP ? (
        <Text style={typo.normal}>
          {t('mission-thanks-01', { total, left: FULL_AIRDROP - total })}
        </Text>
      ) : null}
      {total === FULL_AIRDROP ? (
        <Text style={typo.normal}>{t('mission-thanks-02')}</Text>
      ) : null}
      <Text style={typo.normal}>{t('mission-thanks-03')}</Text>
      <Text style={typo.normal}>{t('mission-thanks-04')}</Text>
      <Text style={typo.normal}>{t('mission-thanks-05')}</Text>

      {missionRewardError ? (
        <Text style={typo.warning}>{missionRewardError}</Text>
      ) : null}

      <View style={grid.group}>
        <Text style={grid.groupTitle}>{t('mission-reward-title')}</Text>
        <View style={style.row}>
          <View style={style.rowItem}>
            <Text style={style.value}>+{missionReward} XSB</Text>
          </View>
          <View style={style.rowItemRight}>
            {missionSignature ? (
              <Button
                title="scan"
                type="clear"
                onPress={() => {
                  Linking.openURL(`https://solscan.io/tx/${missionSignature}`);
                }}
              />
            ) : null}
          </View>
        </View>
      </View>

      <View style={grid.group}>
        <Button
          type="outline"
          title={t('setting-ref-share')}
          onPress={onShare}
        />
      </View>
    </View>
  );
};
