import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Button, CheckBox, Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-community/clipboard';

import Icon from '../../components/Icon';
import Routes from '../../navigators/Routes';
import { grid, typo, input } from '../../components/Styles';
import { COLORS, FONT_SIZES, LINE_HEIGHT } from '../../theme';
import { useApp } from '../../core/AppProvider';

const s = StyleSheet.create({
  main: {
    flex: 1,
  },
  body: {
    padding: 20,
  },
  title: {
    textAlign: 'left',
    fontSize: FONT_SIZES.lg,
  },
  wrp: {
    marginBottom: 12,
  },
  mnemonicWrp: {
    backgroundColor: COLORS.dark0,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 8,
  },
  mnemonic: {
    color: COLORS.white0,
    fontSize: FONT_SIZES.lg,
    lineHeight: LINE_HEIGHT.lg,
  },
  footer: {
    backgroundColor: COLORS.dark2,
    position: 'absolute',
    bottom: 0,
    flex: 1,
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
    width: '100%',
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    marginLeft: 0,
    paddingLeft: 0,
  },
});

type Props = {};

const EditWallet: React.FC<Props> = ({ route }) => {
  const { address } = route.params;
  const navigation = useNavigation();

  const [walletName, setWalletName] = useState(address?.name || '');
  const [isStored, setIsStored] = useState<boolean>(address?.isStored);
  const [loading, setLoading] = useState(false);
  const { updateAddress } = useApp();

  const submit = async () => {
    setLoading(true);
    try {
      await updateAddress(address?.id, walletName, isStored);
      navigation.navigate(Routes.Home, { screen: Routes.Wallet });
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(address.mnemonic);
  };

  return (
    <View style={grid.container}>
      <SafeAreaView style={grid.wrp}>
        <ScrollView>
          <View style={s.body}>
            <Input
              label="Tên Ví"
              placeholder=""
              style={typo.input}
              labelStyle={input.label}
              containerStyle={input.container}
              value={walletName}
              onChangeText={(text: string) => setWalletName(text)}
            />
            <Text style={[typo.title, s.title]}>Lưu mã khôi phục</Text>

            <View style={s.wrp}>
              <Text style={typo.normal}>
                Vui lòng lưu trữ 24 chữ cái bên dưới ở nơi an toàn, và giữ
                nguyên thứ tự.
              </Text>
            </View>

            <View style={s.mnemonicWrp}>
              <Text style={s.mnemonic}>{address.mnemonic || '-'}</Text>
            </View>

            <View style={s.wrp}>
              <Button
                title="Sao chép"
                type="clear"
                onPress={copyToClipboard}
                titleStyle={{ marginLeft: 8 }}
                icon={<Icon name="addfile" color={COLORS.blue2} />}
              />
            </View>

            <View style={[s.wrp, { marginTop: 8 }]}>
              <Text style={typo.warning}>
                Không chia sẻ các mã khôi phục này với bất kỳ ai.
              </Text>
              <Text style={typo.helper}>
                Bạn cần mã này để khôi phục ví trong trường hợp điện thoại của
                bạn bị mất hoặc hư hỏng.
              </Text>
              <Text style={typo.helper}>
                Mã khôi phục này chỉ được lưu trên thiết bị của bạn, và được mã
                hóa bằng mã PIN của bạn.
              </Text>
              <Text style={typo.helper}>
                Nếu bạn chưa thể lưu nó lúc này, bạn vẫn có thể truy cập lại nó
                ở phần Cài Đặt sau khi ví được tạo.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={s.footer}>
          <CheckBox
            containerStyle={s.checkboxContainer}
            textStyle={{ color: COLORS.white2 }}
            title="Tôi đã lưu mã khôi phục"
            checked={isStored}
            onPress={() => setIsStored((prev) => !prev)}
          />
          <Button
            title="Chỉnh sửa Ví"
            style={grid.button}
            loading={loading}
            onPress={submit}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default EditWallet;