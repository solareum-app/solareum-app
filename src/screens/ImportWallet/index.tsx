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
import { useApp } from '../../core/AppProvider/AppProvider';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';

const s = StyleSheet.create({
  wrp: {
    marginBottom: 12,
  },
  title: {
    ...typo.title,
    textAlign: 'left',
    fontSize: FONT_SIZES.lg,
    color: COLORS.blue2,
  },
  label: {
    ...typo.title,
    textAlign: 'left',
    fontSize: FONT_SIZES.lg,
    color: COLORS.blue2,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  recoverPhrase: {
    borderWidth: 1,
    borderColor: COLORS.blue4,
    backgroundColor: COLORS.dark0,
    color: COLORS.white2,
    fontSize: FONT_SIZES.lg,
    lineHeight: LINE_HEIGHT.lg,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 20,
    height: 180,
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  footer: {
    marginTop: 24,
  },
});

type Props = {};
const ImportWallet: React.FC<Props> = () => {
  const navigation = useNavigation();
  const [recovery, setRecovery] = useState('');
  const [walletName, setWalletName] = useState('');
  const { createAddress } = useApp();
  const { t } = useLocalize();

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
                label={t('import-wallet-name')}
                placeholder=""
                style={typo.input}
                labelStyle={s.label}
                containerStyle={input.container}
                value={walletName}
                onChangeText={(text) => setWalletName(text)}
              />
            </View>

            <View style={s.wrp}>
              <Text style={s.title}>{t('import-seed-phrase')}</Text>
              <TextInput
                style={s.recoverPhrase}
                multiline={true}
                value={recovery}
                onChangeText={(text) => setRecovery(text)}
              />
              <Text style={typo.helper}>{t('import-note')}</Text>
              <Button title={t('import-paste')} type="clear" onPress={paste} />
            </View>

            <View style={s.footer}>
              <Button
                title={t('import-btn-label')}
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
