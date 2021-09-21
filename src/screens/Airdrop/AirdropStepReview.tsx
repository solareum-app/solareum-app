import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';

import { grid, typo } from '../../components/Styles';
import { style as s } from './style';

export const AirdropStepReview = ({
  next,
  refAddress,
  airdrop,
  rewardRef,
  loading,
  error,
}) => {
  return (
    <View style={s.main}>
      <Text style={typo.title}>Xem lại thông tin đã nhập</Text>
      <View style={grid.group}>
        <Text style={grid.groupTitle}>Địa chỉ người giới thiệu cho bạn</Text>
        <Text style={grid.groupValue}>{refAddress}</Text>
        <Text style={grid.groupTitle}>Bạn nhận được</Text>
        <Text style={grid.groupValue}>+{airdrop} XSB</Text>
        <Text style={grid.groupTitle}>Người giới thiệu nhận được</Text>
        <Text style={grid.groupValue}>+{rewardRef} XSB</Text>
        <Text style={typo.helper}>
          Số lượng XSB thực tế bạn nhận được có thể sẽ khác so với ước tính ban
          đầu.
        </Text>
      </View>
      <View style={s.footer}>
        {error ? <Text style={typo.critical}>{error}</Text> : null}
        <Button
          type="outline"
          title="Chuẩn rồi, nhận thưởng thôi"
          onPress={next}
          loading={loading}
        />
      </View>
    </View>
  );
};
