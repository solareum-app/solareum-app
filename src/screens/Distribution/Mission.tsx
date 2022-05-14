import React from 'react';
import { View, Text, StyleSheet, Share } from 'react-native';
import { Button as SimpleBtn } from 'react-native-elements';

import { typo } from '../../components/Styles';
import { useRewards } from '../../core/AppProvider/RewardsProvider';
import { Button } from '../../components/Button/Button';
import { usePrice } from '../../core/AppProvider/PriceProvider';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';
import { COLORS } from '../../theme';

const s = StyleSheet.create({
  main: {
    marginTop: 24,
    marginBottom: 40,
    padding: 0,
  },
  body: {
    marginBottom: 24,
  },
  message: {
    ...typo.normal,
  },
});

const btn = StyleSheet.create({
  title: { color: COLORS.white4 },
  body: {
    marginTop: 12,
  },
});

export const Mission = () => {
  const { t } = useLocalize();
  const { accountList } = usePrice();
  const { getRewards, loading, missionLeft } = useRewards();
  const solAccount = accountList.find((i) => i.mint === 'SOL');

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

  return (
    <View>
      <View style={s.main}>
        <View style={s.body}>
          <Text style={typo.titleLeft}>
            Complete the mission to get rewards
          </Text>
          <Text style={s.message}>
            Every day you need to show up here to receive a distribution of
            0.055% from your XSB balance.
          </Text>
          <Text style={s.message}>
            Your referrer will receive 0.015% as well. You can share Solareum
            with others to receive referral fees from them.
          </Text>
        </View>

        <Button
          title="Get Daily Rewards"
          onPress={getRewards}
          disabled={missionLeft <= 0}
          loading={loading}
        />

        <SimpleBtn
          type="clear"
          title="Share Solareum"
          onPress={onShare}
          titleStyle={btn.title}
          buttonStyle={btn.body}
        />
      </View>
    </View>
  );
};
