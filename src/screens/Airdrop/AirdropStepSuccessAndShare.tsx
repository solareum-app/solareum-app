import React from 'react';
import { View, Text, StyleSheet, Share, Linking } from 'react-native';
import { Button } from 'react-native-elements';
import LottieView from 'lottie-react-native';

import { grid, typo } from '../../components/Styles';
import { useToken } from '../../core/AppProvider/TokenProvider';

import { style as s } from './style';
import { COLORS } from '../../theme';

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
    // backgroundColor: 'blue',
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

export const AirdropStepSuccessAndShare = ({
  next,
  airdrop,
  rewardRef,
  airdropSignature,
  rewardRefSignature,
}) => {
  const { accountList } = useToken();
  const solAccount = accountList.find((i) => i.mint === 'SOL');

  const onShare = async () => {
    try {
      const message = `Tải Solareum Wallet - https://solareum.app/getwallet. Nhập địa chỉ SOL của mình để nhận Airdrop nhé - ${solAccount?.publicKey}`;

      const result = await Share.share({
        message,
      });
      return result;
    } catch { }
  };

  return (
    <View style={s.main}>
      <Text style={typo.title}>Nhận Airdrop thành công</Text>
      <View style={style.imgWrp}>
        <LottieView
          autoPlay
          loop
          source={require('../../theme/lottie/award-badge.json')}
          style={style.img}
        />
      </View>
      <View style={grid.group}>
        <Text style={grid.groupTitle}>Bạn nhận được</Text>
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

        <Text style={grid.groupTitle}>Người giới thiệu nhận được</Text>
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
      <Text style={typo.normal}>Cảm ơn bạn đã tham gia chương trình,</Text>
      <Text style={typo.normal}>
        Hãy trở thành người giới thiệu bằng cách chia sẻ app Solareum tới bạn bè
        và người thân, để nhận được XSB không giới hạn từ&nbsp;Solareum.
      </Text>
      <View style={s.footer}>
        <Button
          type="outline"
          title="Chia sẻ Solareum Wallet"
          onPress={() => {
            onShare();
            next();
          }}
        />
      </View>
    </View>
  );
};
