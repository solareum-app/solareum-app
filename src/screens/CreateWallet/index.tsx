import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-community/clipboard';

import Icon from '../../components/Icon';
import { generateMnemonicAndSeed } from '../../spl-utils/wallet-account';
import Routes from '../../navigators/Routes';
import { grid, typo } from '../../components/Styles';
import { COLORS, FONT_SIZES, LINE_HEIGHT } from '../../theme';
import WalletFactory from '../../factory/Wallet';

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
  seedWrp: {
    backgroundColor: COLORS.dark0,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 8,
  },
  seed: {
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
    width: '100%'
  }
});

type Props = {};
const CreateWallet: React.FC<Props> = () => {
  const navigation = useNavigation();
  const [seed, setSeed] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [isStored, setIsStored] = useState(false);
  // TODO: Allow user to choose wallet name when creating
  const [name, setName] = useState('');

  const getSeed = async () => {
    const { seed: s, mnemonic: m } = await generateMnemonicAndSeed();
    setSeed(s);
    setMnemonic(m);
  };

  const handleCreateWallet = async () => {
    await WalletFactory.create(seed, mnemonic, name, isStored);
    navigation.navigate(Routes.Home, { screen: Routes.Wallet });
  };

  const copyToClipboard = () => {
    Clipboard.setString(mnemonic);
  };

  useEffect(() => {
    getSeed();
  }, []);

  return (
    <View style={grid.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 2 }}>
          <View style={s.body}>
            <Text style={[typo.title, s.title]} >
              Lưu mã khôi phục
            </Text>

            <View style={s.wrp}>
              <Text style={typo.normal}>
                Vui lòng lưu trữ 24 chữ cái bên dưới ở nơi an toàn, và giữ nguyên thứ tự.
              </Text>
            </View>

            <View style={s.seedWrp}>
              <Text style={s.seed}>
                {mnemonic || '-'}
              </Text>
            </View>

            <View style={s.wrp}>
              <Button
                title="Sao chép"
                type="clear"
                onPress={copyToClipboard}
                titleStyle={{ marginLeft: 8, }}
                icon={<Icon name='addfile' color={COLORS.blue2} />} />
            </View>

            <View style={[s.wrp, { marginTop: 8 }]}>
              <Text style={typo.warning}>
                Không chia sẻ các mã khôi phục này với bất kỳ ai.
              </Text>
              <Text style={typo.helper}>
                Bạn cần mã này để khôi phục ví trong trường hợp điện thoại của bạn bị mất hoặc hư hỏng.
              </Text>
              <Text style={typo.helper}>
                Mã khôi phục này chỉ được lưu trên thiết bị của bạn, và được mã hóa bằng mã PIN của bạn.
              </Text>
              <Text style={typo.helper}>
                Nếu bạn chưa thể lưu nó lúc này, bạn vẫn có thể truy cập lại nó ở phần Cài Đặt sau khi ví được tạo.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={s.footer}>
          <CheckBox
            containerStyle={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              marginLeft: 0,
              paddingLeft: 0,
            }}
            textStyle={{ color: COLORS.white2 }}
            title="Tôi đã lưu mã khôi phục"
            checked={isStored}
            onPress={() => setIsStored(prev => !prev)}
          />
          <Button title="Tạo Ví" onPress={handleCreateWallet} style={grid.button} />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CreateWallet;
