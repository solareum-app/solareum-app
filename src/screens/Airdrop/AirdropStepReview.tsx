import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';

import { grid, typo } from '../../components/Styles';
import { useToken } from '../../core/AppProvider/TokenProvider';
import { SOL_BALANCE_TARGET } from './const';

import { style as s } from './style';

export const AirdropStepReview = ({ next, refAddress }) => {
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
      <Text style={typo.title}>Xem lại thông tin đã nhập</Text>
      <View style={grid.group}>
        <Text style={grid.groupTitle}>Địa chỉ người giới thiệu cho bạn</Text>
        <Text style={grid.groupValue}>{refAddress}</Text>
        <Text style={grid.groupTitle}>Bạn nhận được</Text>
        <Text style={grid.groupValue}>+20 XSB</Text>
        <Text style={grid.groupTitle}>Người giới thiệu nhận được</Text>
        <Text style={grid.groupValue}>+75 XSB</Text>
      </View>
      <View style={s.footer}>
        <Button
          type="outline"
          title="Chuẩn rồi, nhận thưởng thôi"
          disabled={!active}
          onPress={next}
        />
      </View>
    </View>
  );
};
