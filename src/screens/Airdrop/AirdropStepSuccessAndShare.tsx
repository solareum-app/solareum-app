import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';

import { grid, typo } from '../../components/Styles';
import { useToken } from '../../core/AppProvider/TokenProvider';
import { SOL_BALANCE_TARGET } from './const';

import { style as s } from './style';

export const AirdropStepSuccessAndShare = ({ next }) => {
  const { accountList } = useToken();

  const solAccount = accountList.find((i) => i.mint === 'SOL');
  let active = false;
  if (solAccount) {
    active =
      solAccount.amount * Math.pow(10, solAccount.decimals) >=
      SOL_BALANCE_TARGET;
  }

  return (
    <View style={s.main}>
      <Text style={typo.title}>Nhận Airdrop thành công</Text>
      <Text style={typo.normal}>Cảm ơn bạn đã tham gia chương trình.</Text>
      <View style={grid.group}>
        <Text style={grid.groupTitle}>Bạn nhận được</Text>
        <Text style={grid.groupValue}>+20 XSB</Text>
        <Text style={grid.groupTitle}>Người giới thiệu nhận được</Text>
        <Text style={grid.groupValue}>+75 XSB</Text>
      </View>
      <Text style={typo.normal}>
        Hãy trở thành người giới thiệu bằng cách chia sẻ app Solareum tới bạn bè
        và người thân, để nhận được phần thưởng không giới hạn từ&nbsp;Solareum.
      </Text>
      <View style={s.footer}>
        <Button
          type="outline"
          title="Chia sẻ Solareum Wallet"
          disabled={!active}
          onPress={next}
        />
        <Button
          type="clear"
          title="Thông tin chi tiết"
          containerStyle={s.button}
          onPress={next}
        />
      </View>
    </View>
  );
};
