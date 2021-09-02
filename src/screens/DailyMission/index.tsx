import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';

import { Rewarded, Banner } from '../../components/Admob/Rewarded';
import { grid, typo } from '../../components/Styles';
import { useConfig } from '../../core/AppProvider/RemoteConfigProvider';

const s = StyleSheet.create({
  wrp: {
    marginBottom: 24,
  },
  helper: {
    ...typo.helper,
    marginTop: 8,
  },
  scroller: {
    flex: 1,
  },
});

type Props = {};

const DailyMission: React.FC<Props> = () => {
  const { admob } = useConfig();

  return (
    <View style={grid.container}>
      <ScrollView style={s.scroller}>
        <View style={grid.content}>
          <View style={s.wrp}>
            <Text style={typo.normal}>
              Mỗi ngày bạn có 5 lượt điểm danh bằng cách xem quảng cáo, với mỗi
              lượt hoàn thành xem quảng cáo bạn sẽ nhận được một lượng token XSB
              nhất định. Khi đủ số lượng XSB bạn có thể bán token này trên tất
              cả các thị trường hỗ trợ.
            </Text>
            <Text style={typo.normal}>
              Số tiền nhận được từ quảng cáo, team Solareum sẽ trích một phần để
              mua lại XSB trên thị trường. Vừa để tạo thanh khoản cho thị
              trường, vừa để reward lại cho cộng đồng đã hỗ trợ team Solareum.
            </Text>
            <Text style={typo.normal}>
              Bạn lưu ý là hoàn tất quảng cáo - không tắt giữa chừng để hoàn
              thành nhiệm vụ nhé. Cùng Solareum tích tiểu thành đại.
            </Text>
          </View>

          <View style={s.wrp}>
            <Rewarded disabled={!admob} />
            {!admob ? (
              <Text style={s.helper}>
                Hiện tại tính năng này đang tạm khóa.
              </Text>
            ) : null}
          </View>

          <View style={s.wrp}>
            <Banner />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DailyMission;
