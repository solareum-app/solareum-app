import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';

import { typo } from '../../components/Styles';
import { useToken } from '../../core/AppProvider/TokenProvider';
import { SOL_BALANCE_TARGET } from './const';
import { style as s } from './style';

export const AirdropStepInfo = ({ dismiss, next }) => {
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
      <Text style={typo.title}>XSB Airdrop</Text>
      <Text style={typo.normal}>Airdrop sẽ gồm 3 bước</Text>
      <Text style={typo.normal}>
        1. Tạo tài khoản XSB, bạn cần có ít nhất ~{SOL_BALANCE_TARGET} SOL để
        thực hiện việc&nbsp;này. Nếu bạn đã có tài khoản XSB, hệ thống sẽ tự bỏ
        qua bước này.
      </Text>
      <Text style={typo.normal}>
        2. Nhập địa chỉ XSB hoặc SOL của người đã giới thiệu cho&nbsp;bạn.
      </Text>
      <Text style={typo.normal}>
        3. Xong, bạn và người giới thiệu sẽ nhận được&nbsp;XSB.
      </Text>

      {!active ? (
        <Text style={typo.caution}>
          Bạn không có đủ SOL, hãy nạp SOL để tiếp tục.
        </Text>
      ) : null}

      <View style={s.footer}>
        <Button
          type="outline"
          title="Okie, Tiếp Tục"
          onPress={next}
          disabled={!active}
        />
        <Button
          type="clear"
          title="Không quan tâm"
          containerStyle={s.button}
          onPress={dismiss}
        />
      </View>
    </View>
  );
};
