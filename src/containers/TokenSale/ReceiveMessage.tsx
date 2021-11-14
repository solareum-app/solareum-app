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

export const ReceiveMessage = ({ purchase }) => {
  const { t } = useLocalize();

  const qty = purchase.qty;
  const signature = purchase.signature;
  let error = purchase.error;

  return (
    <View style={style.main}>
      <Text style={typo.title}>Your Purchase Completed</Text>
      <View style={style.imgWrp}>
        <LottieView
          autoPlay
          loop
          source={require('../../theme/lottie/award-badge.json')}
          style={style.img}
        />
      </View>

      <Text style={typo.normal}>
        Thank you for participating in the Token Sales, we highly appreciate it.
        Let's stay strong together in the adventures journey ahead.
      </Text>
      {error ? <Text style={typo.warning}>{error}</Text> : null}

      <View style={grid.group}>
        <Text style={grid.groupTitle}>{t('mission-reward-title')}</Text>
        <View style={style.row}>
          <View style={style.rowItem}>
            <Text style={style.value}>+{qty} XSB</Text>
          </View>
          <View style={style.rowItemRight}>
            {signature ? (
              <Button
                title="scan"
                type="clear"
                onPress={() => {
                  Linking.openURL(`https://solscan.io/tx/${signature}`);
                }}
              />
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};
