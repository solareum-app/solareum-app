import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Button } from 'react-native-elements';
import LottieView from 'lottie-react-native';

import { grid, typo } from '../../components/Styles';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';
import { COLORS } from '../../theme';

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

export const MissionReward = ({ mission }) => {
  const { t } = useLocalize();

  const missionReward = mission.missionReward;
  const missionSignature = mission.missionRewardSignature;
  let missionRewardError = mission.missionRewardError;

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

      <Text style={typo.normal}>{t('mission-thanks-01')}</Text>
      <Text style={typo.normal}>
        XSB powers Lightning Rewards, which connects the current digital world
        to the future of decentralization - web3.0.
      </Text>
      <Text style={typo.normal}>
        Don't forget to share Solareum Wallet with your network to receive
        unlimited XSB as referrals.
      </Text>
      <Text style={typo.normal}>
        If you're unable to receive the airdrop, please make sure your SOL
        balance is positive.
      </Text>
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
    </View>
  );
};
