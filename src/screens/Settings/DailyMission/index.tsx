import React from 'react';
import { View, StyleSheet, Text, ScrollView, SafeAreaView } from 'react-native';

import { Rewarded, Banner } from '../../../components/Admob/Rewarded';
import { grid, typo } from '../../../components/Styles';
import { useConfig } from '../../../core/AppProvider/RemoteConfigProvider';
import { useLocalize } from '../../../core/AppProvider/LocalizeProvider';

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
  const { admob } = useConfig();
  const { t } = useLocalize();

  return (
    <View style={grid.container}>
      <SafeAreaView style={grid.wrp}>
        <ScrollView>
          <View style={grid.content}>
            <View style={s.wrp}>
              <Text style={typo.normal}>{t('airdrop-mission-message-01')}</Text>
              <Text style={typo.normal}>{t('airdrop-mission-message-02')}</Text>
              <Text style={typo.normal}>{t('airdrop-mission-message-03')}</Text>
              <Text style={typo.normal}>
                {t('airdrop-mission-message-04', { amount: 0 })}
              </Text>
            </View>

            <View style={s.wrp}>
              <Rewarded disabled={!admob} />
              {!admob ? (
                <Text style={s.helper}>
                  {t('airdrop-mission-lock-message')}
                </Text>
              ) : null}
            </View>

            <View style={s.wrp}>
              <Banner />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default DailyMission;
