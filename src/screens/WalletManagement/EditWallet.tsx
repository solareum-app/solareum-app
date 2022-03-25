import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  NativeModules,
  Platform,
  Alert,
} from 'react-native';
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

const { RNCloudFs, RNFSManager } = NativeModules;
import base64 from 'react-native-base64';
import RNFetchBlob from 'rn-fetch-blob';

import {
  getParamsInURL,
  updateQueryStringParameter,
} from '../../utils/handleLink';

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
    var targetPath = walletName + '/private-key.txt';
    console.log(targetPath);
    RNCloudFs.fileExists({
      targetPath: targetPath,
    })
      .then((exists) => {
        if (!exists) {
          RNCloudFs.createFile({
            targetPath: targetPath,
            content: address.mnemonic,
            scope: 'visible',
          });
          console.log('create file');
        } else {
          console.log('this file exists');
        }
      })
      .catch((err) => {
        console.warn('it failed', err);
      });

    Alert.alert(
      'Sync',
      'Private-key is sync in cloud',
      [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
        },
      ],
      { cancelable: true },
    );
  };

  const handleLinkDownloadIOS = (url) => {
    const params = getParamsInURL(url);
    console.log(params);
    // set parma K
    const paramK = params['k'].substring(2, params['k'].length - 1);
    console.log(paramK);
    url = updateQueryStringParameter(url, 'k', params[paramK]);

    // set file name
    const paramFile = params['f'];
    url = url.replace('${f}', paramFile);

    // cut header
    url = url.substring(
      url.indexOf('https://cvws.icloud-content.com'),
      url.length,
    );
    const paramS = params['s'];
    var indexParamS = url.indexOf(paramS);

    // cut footer
    url.substring(0, indexParamS + paramS.length - 1);
    return url;
  };

  const handleLinkDownloadGoogleDrive = (url) => {
    var basicLink = 'https://drive.google.com/uc?export=download&id=';
    //cut header
    var headerLink = 'https://drive.google.com/file/d/';

    console.log('🚩 handle link: ', url);
    url = url.substring(headerLink.length, url.length);

    //cut footer
    url = url.substring(0, url.indexOf('/'));
    url = basicLink + url;
    console.log('🎉 linkkk : ');
    return url;
  };

  

  const getContentFile = (url) => {
    console.log('🚩 url: ', url);
    var path = '';
    let dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob.config({
      path: dirs.DocumentDir + '/' + walletName + '/private-key.txt',
    })
      .fetch('GET', url, {
      })
      .then((res) => {
        console.log('The file saved to ', res.path());
        path = res.path();
        console.log('The data in file: ', res);
        readFile(path);
      });
  };

  const getPrivateKey = () => {
    RNCloudFs.listFiles({
      targetPath: walletName + '/private-key.txt',
      scope: 'visible',
    }).then(async (files) => {
      console.log(files);
      var link = decodeURIComponent(files.files[0].uri);
      if (Platform.OS === 'ios') {
        link = handleLinkDownloadIOS(link);
      } else {
        link = handleLinkDownloadGoogleDrive(link);
        console.log(link);
      }
      getContentFile(link);
    });
  };

  const readFile = async (url) => {
    const exportedFileContent = await RNFSManager.readFile(url);
    console.log('🎉 content encode: ', base64.decode(exportedFileContent));
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
                title={'sync'}
                type="clear"
                onPress={sync}
                titleStyle={{ marginLeft: 8 }}
                icon={<Icon name="addfile" color={COLORS.blue2} />}
              />
            </View>

            <View style={{ height: 20 }}></View>
            <Button
              title="Get private key"
              onPress={getPrivateKey}
              titleStyle={{ marginLeft: 8 }}
            />

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
