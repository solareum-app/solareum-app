import { Banner } from '@Components/Admob/Rewarded';
import { useLocalize } from '@Core/AppProvider/LocalizeProvider';
import { COLORS } from '@Theme/index';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const s = StyleSheet.create({
  alertZone: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backgroundColor: COLORS.dark0,
  },
  wrp: {
    marginBottom: 24,
  },
  footer: {
    textAlign: 'center',
    position: 'absolute',
    paddingHorizontal: 20,
    marginBottom: 40,
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomText: {
    color: COLORS.white4,
    textAlign: 'center',
    marginBottom: 8,
  },
});

const BREAK_TIME = 20000; // 15s
let lastMissionTs = Date.now();

export const BannerScreen = ({ next }: any) => {
  const [currentTs, setCurrentTs] = useState(-1);
  const { t } = useLocalize();

  useEffect(() => {
    lastMissionTs = Date.now();
  }, []);

  useEffect(() => {
    let lastMissionInterval = setInterval(() => {
      setCurrentTs(Date.now());
    }, 1000);

    return () => {
      clearInterval(lastMissionInterval);
    };
  }, []);

  useEffect(() => {
    if (currentTs - lastMissionTs > BREAK_TIME) {
      next();
    }
  }, [currentTs, next]);

  const delta = currentTs - lastMissionTs;
  const waitingTime = Math.round(Math.abs((BREAK_TIME - delta) / 1000));

  return (
    <View style={s.alertZone}>
      <View style={s.wrp}>
        <Banner />
      </View>
      <View style={s.wrp}>
        <Banner />
      </View>
      <View style={s.footer}>
        <Text style={s.bottomText}>
          {t('mission-close-label', {
            second: waitingTime,
          })}
        </Text>
      </View>
    </View>
  );
};
