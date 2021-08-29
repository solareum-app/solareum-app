import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Button, CheckBox, Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-community/clipboard';

import Icon from '../../components/Icon';
import Routes from '../../navigators/Routes';
import { grid, typo, input } from '../../components/Styles';
import { COLORS } from '../../theme';
import { useApp } from '../../core/AppProvider/AppProvider';
import { s } from './CreateWallet';

type Props = {};

const EditWallet: React.FC<Props> = ({ route }) => {
  const { address } = route.params;
  const navigation = useNavigation();

  const [walletName, setWalletName] = useState(address?.name || '');
  const [isStored, setIsStored] = useState<boolean>(address?.isStored);
  const [loading, setLoading] = useState(false);
  const { updateAddress, removeWallet, addressId } = useApp();

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

  const remove = async () => {
    await removeWallet(addressId);
    navigation.navigate(Routes.Home);
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
              labelStyle={s.label}
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
                Mã khôi phục này chỉ được lưu trên thiết bị của bạn.
                {/* và được mã hóa bằng mã PIN của bạn. */}
              </Text>
              <Text style={typo.helper}>
                Bạn có thể dùng mã này để import vào các ví khác, như: Phantom,
                Sollet, Coin98...
              </Text>
              <Text style={typo.helper}>
                Nếu bạn chưa thể lưu nó lúc này, bạn vẫn có thể truy cập lại nó
                ở phần Cài Đặt sau khi ví được tạo.
              </Text>
            </View>
            <View style={[s.wrp, { marginTop: 80 }]}>
              <Button
                title="Xóa ví"
                buttonStyle={grid.buttonCritical}
                containerStyle={grid.buttonCritical}
                titleStyle={grid.buttonCriticalTitle}
                onPress={remove}
                type="outline"
              />
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
