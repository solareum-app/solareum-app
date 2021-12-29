import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, SafeAreaView } from 'react-native';

import { grid, typo } from '../../../components/Styles';
import { useLocalize } from '../../../core/AppProvider/LocalizeProvider';

import { authFetch } from '../../../utils/authfetch';
import { service } from '../../../config';
import { useMetaData } from '../../../hooks/useMetaData';
import { usePrice } from '../../../core/AppProvider/PriceProvider';

const s = StyleSheet.create({
  wrp: {
    marginBottom: 24,
  },
  helper: {
    ...typo.helper,
    marginTop: 8,
  },
});

type Props = {};

const DailyMission: React.FC<Props> = () => {
  const [missionReward, setMissionReward] = useState(0);
  const metaData = useMetaData();
  const { accountList } = usePrice();
  const { t } = useLocalize();

  const solAccount = accountList.find((i) => i.mint === 'SOL');

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
    setMissionReward(resp.missionReward);
  };

  useEffect(() => {
    loadCheckMission();
  }, [accountList]);

  return (
    <View style={grid.container}>
      <SafeAreaView style={grid.wrp}>
        <ScrollView>
          <View style={grid.content}>
            <View style={s.wrp}>
              <Text style={typo.normal}>{t('airdrop-mission-message-01')}</Text>
              <Text style={typo.normal}>{t('airdrop-mission-message-02')}</Text>
              <Text style={typo.normal}>
                {t('airdrop-mission-message-03')}{' '}
                {t('airdrop-mission-message-04', { amount: missionReward })}
              </Text>
              <Text style={typo.normal}>{t('airdrop-mission-message-05')}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default DailyMission;
