import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Share } from 'react-native';
import { Button as SimpleBtn } from 'react-native-elements';

import { typo } from '../../components/Styles';
import { useRewards } from '../../core/AppProvider/RewardsProvider';
import { Button } from '../../components/Button/Button';
import { usePrice } from '../../core/AppProvider/PriceProvider';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';
import { COLORS } from '../../theme';
import { box } from './style';
import { authFetch } from '../../utils/authfetch';

const s = StyleSheet.create({
  main: {
    marginTop: 24,
    marginBottom: 40,
    padding: 0,
  },
  mission: {
    marginBottom: 48,
  },
  section: {
    marginBottom: 24,
  },
  body: {
    marginBottom: 24,
  },
  message: {
    ...typo.normal,
  },
});

const btn = StyleSheet.create({
  title: {
    color: COLORS.blue,
  },
  body: {
    borderColor: COLORS.blue,
    height: 56,
  },
});

export const Mission = () => {
  const { t } = useLocalize();
  const { accountList } = usePrice();
  const { getRewards, loading, missionLeft } = useRewards();

  const [noRef, setNoRef] = useState<number>(0);

  const solAccount = accountList.find((i) => i.mint === 'SOL');
  const solAddress = solAccount?.publicKey;

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
      const numberRef = await authFetch(
        `/wallets/count?nominated_by=${solAddress}`,
        {
          method: 'get',
        },
      );
      setNoRef(numberRef);
    })();
  }, [accountList]);

  return (
    <View>
      <View style={s.main}>
        <View style={s.mission}>
          <View style={s.body}>
            <Text style={typo.titleLeft}>
              Complete the mission to get rewards
            </Text>
            <Text style={s.message}>
              Every day you need to show up here to receive a distribution of
              0.055% from your XSB balance. Your referrer will receive 0.015% as
              well.
            </Text>
          </View>

          <Button
            title={missionLeft > 0 ? 'Get Daily Rewards' : 'Mission Completed'}
            onPress={getRewards}
            disabled={missionLeft <= 0}
            loading={loading}
          />
        </View>

        <View style={s.section}>
          <View style={s.body}>
            <Text style={typo.titleLeft}>Your Referrals</Text>
            <Text style={s.message}>
              Let's share Solareum with your friends to receive unlimited
              referral fees.
            </Text>

            <View style={box.main}>
              <View style={box.left}>
                <Text style={box.title}>Total member</Text>
              </View>
              <View style={box.right}>
                <View style={box.badge}>
                  <Text style={box.value}>{noRef}</Text>
                </View>
              </View>
            </View>
          </View>
          <SimpleBtn
            type="outline"
            title="Share Solareum"
            onPress={onShare}
            titleStyle={btn.title}
            buttonStyle={btn.body}
          />
        </View>
      </View>
    </View>
  );
};
