import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Portal } from 'react-native-portalize';

import { FacebookWebView } from '../../components/Modals/FacebookWebView';
import { grid, typo } from '../../components/Styles';
import Routes from '../../navigators/Routes';
import imgEducation from '../../assets/clip-education.png';

const s = StyleSheet.create({
  wrp: {
    marginBottom: 12,
  },
  placeholderImage: {
    width: 280,
    height: 140,
    marginBottom: 16,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  message: {
    ...typo.normal,
    marginBottom: 8,
  },
  title: { textAlign: 'left' },
});

type Props = {};
const GetStarted: React.FC<Props> = () => {
  const navigation = useNavigation();
  const refPolicy = useRef();

  const createWalletHandler = React.useCallback(() => {
    navigation.navigate(Routes.CreateWallet);
  }, [navigation]);

  const importWalletHandler = React.useCallback(() => {
    navigation.navigate(Routes.ImportWallet);
  }, [navigation]);

  return (
    <View style={grid.container}>
      <SafeAreaView style={grid.wrp}>
        <ScrollView>
          <View style={grid.content}>
            <View style={s.wrp}>
              <Image source={imgEducation} style={s.placeholderImage} />
            </View>
            <View style={s.wrp}>
              <Text style={[typo.title, s.title]}>
                Chào mừng tới Solareum Wallet!
              </Text>
              <Text style={s.message}>
                Solareum Wallet được thiết kế đơn giản tập trung vào 2 tính năng
                chính mà bạn sẽ thực hiện thường xuyên mỗi ngày:
              </Text>
              <Text style={s.message}>
                ▪︎ Lưu trữ, và chuyển nhận SOL cũng như tất cả các SPL tokens.
              </Text>
              <Text style={s.message}>
                ▪︎ Kết nối trực tiếp với Serum DEX, giúp thực hiện nhanh chóng
                các giao dịch trên nền tảng sàn phi tập trung, ngay trên điện
                thoại. Giúp bạn không bỏ lỡ bất kỳ cơ hội đầu tư nào.
              </Text>
            </View>
            <View style={s.wrp}>
              <Button
                title="Điều khoản sử dụng"
                type="clear"
                onPress={() => {
                  refPolicy.current.open();
                }}
                style={grid.button}
              />
            </View>
            <View style={s.wrp}>
              <Button
                title="Tạo Ví"
                onPress={createWalletHandler}
                style={grid.button}
              />
            </View>
            <View style={s.wrp}>
              <Button
                title="Khôi Phục"
                type="outline"
                onPress={importWalletHandler}
                style={grid.button}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Portal>
        <FacebookWebView
          ref={refPolicy}
          url="https://www.wealthclub.vn/t/solareum-wallet-dieu-khoan-su-dung/418"
        />
      </Portal>
    </View>
  );
};

export default GetStarted;
