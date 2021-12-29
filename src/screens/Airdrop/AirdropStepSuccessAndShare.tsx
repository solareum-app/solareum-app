import React from 'react';
import { View, Text, StyleSheet, Share, Linking } from 'react-native';
import { Button } from 'react-native-elements';
import LottieView from 'lottie-react-native';

import { grid, typo } from '../../components/Styles';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';

import { style as s } from './style';
import { COLORS } from '../../theme';
import { usePrice } from '../../core/AppProvider/PriceProvider';

const style = StyleSheet.create({
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
  label: {
    ...typo.normal,
    marginBottom: 0,
  },
});

export const AirdropStepSuccessAndShare = ({
  next,
  airdrop,
  rewardRef,
  airdropSignature,
  rewardRefSignature,
}) => {
  const { accountList } = usePrice();
  const { t } = useLocalize();
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
    } catch { }
  };

  return (
    <View style={s.main}>
      <Text style={typo.title}>{t('airdrop-final-title')}</Text>
      <View style={style.imgWrp}>
        <LottieView
          autoPlay
          loop
          source={require('../../theme/lottie/award-badge.json')}
          style={style.img}
        />
      </View>

      <View style={grid.group}>
        <Text style={grid.groupTitle}>{t('airdrop-final-you-receive')}</Text>
        <View style={style.row}>
          <View style={style.rowItem}>
            <Text style={style.value}>+{airdrop} XSB</Text>
          </View>
          <View style={style.rowItemRight}>
            {airdropSignature ? (
              <Button
                title="scan"
                type="clear"
                onPress={() => {
                  Linking.openURL(`https://solscan.io/tx/${airdropSignature}`);
                }}
              />
            ) : null}
          </View>
        </View>
        <Text style={grid.groupTitle}>{t('airdrop-final-ref-receive')}</Text>
        <View style={style.row}>
          <View style={style.rowItem}>
            <Text style={style.value}>+{rewardRef} XSB</Text>
          </View>
          <View style={style.rowItemRight}>
            {rewardRefSignature ? (
              <Button
                title="scan"
                type="clear"
                onPress={() => {
                  Linking.openURL(
                    `https://solscan.io/tx/${rewardRefSignature}`,
                  );
                }}
              />
            ) : null}
          </View>
        </View>
      </View>

      <Text style={typo.normal}>{t('airdrop-final-thanks-01')}</Text>
      <View style={grid.group}>
        <View style={style.row}>
          <View style={style.rowItem}>
            <Text style={style.label}>{t('airdrop-final-twitter')}</Text>
          </View>
          <View style={style.rowItemRight}>
            <Button
              title="check out"
              type="clear"
              onPress={() => {
                Linking.openURL(t('airdrop-final-twitter-link'));
              }}
            />
          </View>
        </View>
        <View style={style.row}>
          <View style={style.rowItem}>
            <Text style={style.label}>{t('airdrop-final-telegram')}</Text>
          </View>
          <View style={style.rowItemRight}>
            <Button
              title="check out"
              type="clear"
              onPress={() => {
                Linking.openURL(t('airdrop-final-telegram-link'));
              }}
            />
          </View>
        </View>
      </View>
      <Text style={typo.normal}>{t('airdrop-final-thanks-02')}</Text>

      <View style={s.footer}>
        <Button
          type="outline"
          title={t('airdrop-final-share-btn')}
          onPress={() => {
            onShare();
            next();
          }}
        />
      </View>
    </View>
  );
};
