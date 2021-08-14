import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-community/clipboard';

import Routes from '../../navigators/Routes';
import { grid, typo, input } from '../../components/Styles';
import { COLORS, FONT_SIZES, LINE_HEIGHT } from '../../theme';
import { useApp } from '../../core/AppProvider';

const s = StyleSheet.create({
  wrp: {
    marginBottom: 12,
  },
  label: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.white2,
    marginBottom: 8,
  },
  recoverPhrase: {
    backgroundColor: COLORS.dark0,
    color: COLORS.white2,
    fontSize: FONT_SIZES.lg,
    lineHeight: LINE_HEIGHT.lg,
    borderColor: COLORS.dark0,
    borderRadius: 4,
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 20,
    height: 200,
    flexWrap: 'wrap',
    marginBottom: 8,
  },
});

type Props = {};
const ImportWallet: React.FC<Props> = () => {
  const navigation = useNavigation();
  const [recovery, setRecovery] = useState('');
  const [walletName, setWalletName] = useState('');
  const { createAddress } = useApp();

  const importWallet = async () => {
    // TODO: Handle the seed later
    await createAddress('seed', recovery, walletName, true);
    navigation.navigate(Routes.Home, { screen: Routes.Wallet });
  };

  const paste = async () => {
    const text = await Clipboard.getString();
    setRecovery(text);
  };

  return (
    <View style={grid.container}>
      <SafeAreaView style={grid.wrp}>
        <ScrollView>
          <View style={grid.content}>
            <View style={s.wrp}>
              <Input
                label="Tên Ví"
                placeholder=""
                style={typo.input}
                labelStyle={input.label}
                containerStyle={input.container}
                value={walletName}
                onChangeText={(text) => setWalletName(text)}
              />
            </View>
            <View style={s.wrp}>
              <Text style={s.label}>Mã khôi phục</Text>
              <TextInput
                style={s.recoverPhrase}
                multiline={true}
                value={recovery}
                onChangeText={(text) => setRecovery(text)}
              />
              <Text style={typo.helper}>
                Bạn có thể nhập Mã khôi phục từ các SPL wallet khác như: Sollet
              </Text>
              <Button title="Dán mã khôi phục" type="clear" onPress={paste} />
            </View>
            <View style={s.wrp}>
              <Button
                title="Khôi phục Ví"
                onPress={importWallet}
                style={grid.button}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ImportWallet;
