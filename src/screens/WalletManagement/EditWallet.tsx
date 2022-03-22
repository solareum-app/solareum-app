import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, NativeModules, Platform } from 'react-native';
import { Button, CheckBox, Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-community/clipboard';

import Icon from '../../components/Icon';
import Routes from '../../navigators/Routes';
import { grid, typo, input } from '../../components/Styles';
import { COLORS } from '../../theme';
import { useApp } from '../../core/AppProvider/AppProvider';
import { s } from './CreateWallet';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';

const { RNCloudFs } = NativeModules;



type Props = {};

const EditWallet: React.FC<Props> = ({ route }) => {
  const { address } = route.params;
  const navigation = useNavigation();

  const [walletName, setWalletName] = useState(address?.name || '');
  const [isStored, setIsStored] = useState<boolean>(address?.isStored);
  const [loading, setLoading] = useState(false);
  const { updateAddress, removeWallet, addressId } = useApp();
  const { t } = useLocalize();

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


  const sync = async () => {
      RNCloudFs.createFile({
        "targetPath":"private-key.txt",
        "content": address.mnemonic,
         "scope":"visible"
      });
  };


  return (
    <View style={grid.container}>
      <SafeAreaView style={grid.wrp}>
        <ScrollView>
          <View style={s.body}>
            <Input
              label={t('create-title')}
              placeholder=""
              style={typo.input}
              labelStyle={s.label}
              containerStyle={input.container}
              value={walletName}
              onChangeText={(text: string) => setWalletName(text)}
            />
            <Text style={[typo.title, s.title]}>{t('create-store')}</Text>

            <View style={s.wrp}>
              <Text style={typo.normal}>{t('create-store-note')}</Text>
            </View>

            <View style={s.mnemonicWrp}>
              <Text style={s.mnemonic}>{address.mnemonic || '-'}</Text>
            </View>

            <View style={s.wrp}>
              <Button
                title={t('create-copy')}
                type="clear"
                onPress={copyToClipboard}
                titleStyle={{ marginLeft: 8 }}
                icon={<Icon name="addfile" color={COLORS.blue2} />}
              />
            </View>



            <View style={s.wrp}>
              <Button
                title={"sync"}
                type="clear"
                onPress={sync}
                titleStyle={{ marginLeft: 8 }}
                icon={<Icon name="addfile" color={COLORS.blue2} />}
              />
            </View>



            <View style={[s.wrp, { marginTop: 8 }]}>
              <Text style={typo.warning}>{t('create-note-01')}</Text>
              <Text style={typo.helper}>{t('create-note-02')}</Text>
              <Text style={typo.helper}>{t('create-note-03')}</Text>
              <Text style={typo.helper}>{t('create-note-04')}</Text>
              <Text style={typo.helper}>{t('create-note-05')}</Text>
            </View>
            <View style={[s.wrp, { marginTop: 80 }]}>
              <Button
                disabled={!address?.isStored}
                title={t('create-remove-wallet')}
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
            title={t('create-store-checked')}
            checked={isStored}
            onPress={() => setIsStored((prev) => !prev)}
          />
          <Button
            title={t('create-edit-wallet')}
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
