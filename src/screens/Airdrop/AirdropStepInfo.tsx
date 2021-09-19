import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';

import { typo } from '../../components/Styles';
import { SOL_BALANCE_TARGET } from './const';
import { style as s } from './style';

export const AirdropStepInfo = ({ dismiss, next }) => {
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

      <View style={s.footer}>
        <Button type="outline" title="Okie, Tiếp Tục" onPress={next} />
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
