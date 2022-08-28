import { grid, typo } from '@Components/Styles';
import { useLocalize } from '@Core/AppProvider/LocalizeProvider';
import { usePrice } from '@Core/AppProvider/PriceProvider';
import { COLORS } from '@Theme/index';
import LottieView from 'lottie-react-native';
import React from 'react';
import { Linking, Share, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';

const style = StyleSheet.create({
  main: {
    padding: 20,
    ...grid.popover,
  },
  imgWrp: {
    width: 120,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 24,
  },
  img: {
    width: 120,
    height: 120,
  },
  header: {
    marginBottom: 24,
  },
  body: {
    marginBottom: 48,
  },
  box: {
    marginBottom: 12,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  const { accountList } = usePrice();

  const solAccount = accountList.find((i) => i.mint === 'SOL');
  const missionReward = mission.missionReward;
  const missionSignature = mission.missionSignature;
  const missionError = mission.missionError;

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
    <View style={style.main}>
      <View style={style.imgWrp}>
        <LottieView
          autoPlay
          loop
          source={require('../../theme/lottie/hexagonal-medal.json')}
          style={style.img}
        />
      </View>
      <View style={style.header}>
        <Text style={typo.titleLeft}>Thank you for supporting us</Text>
        <Text style={typo.normal}>
          Below is the detail of the distribution. Enjoy the adventure to web3.
          Don't forget to bring your friends here. The more the merrier.
        </Text>
      </View>

      <View style={style.body}>
        <View style={style.box}>
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
                    Linking.openURL(
                      `https://solscan.io/tx/${missionSignature}`,
                    );
                  }}
                />
              ) : null}
            </View>
          </View>
        </View>

        {mission.referSignature ? (
          <View style={style.box}>
            <Text style={grid.groupTitle}>Your referrer received</Text>
            <View style={style.row}>
              <View style={style.rowItem}>
                <Text style={style.value}>+{mission.referReward} XSB</Text>
              </View>
              <View style={style.rowItemRight}>
                {mission.referSignature ? (
                  <Button
                    title="scan"
                    type="clear"
                    onPress={() => {
                      Linking.openURL(
                        `https://solscan.io/tx/${mission.referSignature}`,
                      );
                    }}
                  />
                ) : null}
              </View>
            </View>
          </View>
        ) : null}

        {missionError ? <Text style={typo.warning}>{missionError}</Text> : null}
        {mission.referError ? (
          <Text style={typo.warning}>{mission.referError}</Text>
        ) : null}
        {mission.systemError ? (
          <Text style={typo.warning}>{mission.systemError}</Text>
        ) : null}
      </View>

      <View style={grid.group}>
        <Button type="outline" title="Share Solareum" onPress={onShare} />
      </View>
    </View>
  );
};
