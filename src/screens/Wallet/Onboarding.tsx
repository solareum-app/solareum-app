import { typo } from '@Components/Styles';
import { useLocalize } from '@Core/AppProvider/LocalizeProvider';
import { getItem, setItem } from '@Storage/Collection';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import ImgOnboard from '../../assets/clip-1.png';
import { SwapContainer } from '../Settings/SwapApp';

const ONBOARDING_KEY = 'ONBOARDING_KEY';

const s = StyleSheet.create({
  main: {
    marginTop: -36,
    padding: 24,
  },
  img: {
    width: 140,
    height: 140,
  },
  body: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export const Onboarding = () => {
  const [isOnboard, setIsOnboard] = useState(true);
  const { t } = useLocalize();

  const submit = () => {
    setIsOnboard(true);
    setItem('', ONBOARDING_KEY, true);
  };

  useEffect(() => {
    (async () => {
      const ob = await getItem('', ONBOARDING_KEY);
      setIsOnboard(ob === true);
    })();
  }, []);

  if (isOnboard) {
    return null;
  }

  return (
    <View>
      <View style={{ ...s.main, padding: 24 }}>
        <Image style={s.img} source={ImgOnboard} />
        <Text style={typo.titleLeft}>{t('onboarding-title')}</Text>
        <Text style={typo.normal}>{t('onboarding-message')}</Text>
        <View style={s.body}>
          <SwapContainer />
        </View>
        <Button type="outline" onPress={submit} title={t('onboarding-btn')} />
      </View>
    </View>
  );
};
