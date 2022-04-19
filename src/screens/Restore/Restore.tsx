import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
  PermissionsAndroid,
  NativeModules,
} from 'react-native';
import { Button } from 'react-native-elements';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import GDrive from 'react-native-google-drive-api-wrapper';
import base64 from 'react-native-base64';
import RNFetchBlob from 'rn-fetch-blob';
import LottieView from 'lottie-react-native';

import { grid, typo } from '../../components/Styles';
import {
  getParamsInURL,
  updateQueryStringParameter,
} from '../../utils/handleLink';
import { useApp } from '../../core/AppProvider/AppProvider';
import { BackupData } from '../Settings/Backup/mergeWallets';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../navigators/Routes';

const { RNFSManager, RNCloudFs } = NativeModules;

const s = StyleSheet.create({
  wrp: {
    marginBottom: 24,
  },
  img: {
    height: 220,
    width: 220,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  title: { textAlign: 'left' },
  message: {
    ...typo.normal,
    marginBottom: 8,
  },
});

type Props = {};

const targetPath = 'private-key.json';

export const Restore: React.FC<Props> = () => {
  const { createAddress } = useApp();
  const navigation = useNavigation();

  const [loading, setLoading] = useState<boolean>(false);

  const restoreWallets = async (wallets: BackupData[]) => {
    if (!wallets.length) {
      return;
    }

    for (let i = 0; i < wallets.length; i++) {
      const item = wallets[i];
      await createAddress(
        'seed',
        item.privateKey.trim(),
        item.name.trim(),
        true,
      );
    }

    navigation.navigate(Routes.SettingWallet);
  };

  // check file exists in cloud
  const checkPrivateFileExistsInCloud = async () => {
    let isExists = true;
    await RNCloudFs.listFiles({
      targetPath: '',
      scope: 'visible',
    }).then((files) => {
      if (files.files.length === 0) {
        isExists = false;
      } else {
        let file = files.files.filter((file) => file.name.includes(targetPath));
        if (file.length > 0) {
          isExists = true;
        }
      }
    });
    return isExists;
  };

  const handleLinkDownloadIOS = (url) => {
    const params = getParamsInURL(url);
    // set parma K
    const paramK = params.k.substring(2, params.k.length - 1);
    url = updateQueryStringParameter(url, 'k', params[paramK]);

    // set file name
    const paramFile = params.f;
    url = url.replace('${f}', paramFile);

    // cut header
    url = url.substring(
      url.indexOf('https://cvws.icloud-content.com'),
      url.length,
    );
    const paramS = params.s;
    var indexParamS = url.indexOf(paramS);

    // cut footer
    url.substring(0, indexParamS + paramS.length - 1);
    return url;
  };

  const getGDriveFileID = (url) => {
    //cut header
    var headerLink = 'https://drive.google.com/file/d/';
    url = url.substring(headerLink.length, url.length);

    //cut footer
    url = url.substring(0, url.indexOf('/'));

    return url;
  };

  const getContentFileFromIcloud = async (url) => {
    let path = '';
    let contentFileFromIcloud;
    let dirs = RNFetchBlob.fs.dirs;
    await RNFetchBlob.config({
      path: dirs.DocumentDir + '/private-key.json',
    })
      .fetch('GET', url, {})
      .then((res) => {
        path = res.path();
        contentFileFromIcloud = readFile(path);
      });

    return contentFileFromIcloud;
  };

  const getContentFileFromGDrive = async (url) => {
    var contentFileFromGDrive;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'External Storage Write Permission',
          message: 'App needs write permission',
        },
      );
      // If WRITE_EXTERNAL_STORAGE Permission is granted
      if (granted != PermissionsAndroid.RESULTS.GRANTED) {
        return;
      }
    } catch (err) {
      console.warn(err);
      return;
    }
    try {
      let dirs = RNFetchBlob.fs.dirs;
      const path = dirs.DocumentDir + `\/${targetPath}`;
      GoogleSignin.configure();
      await GoogleSignin.signIn();

      await GoogleSignin.getTokens().then(async (res) => {
        if (res) {
          GDrive.setAccessToken(res.accessToken);
          GDrive.init();
          if (GDrive.isInitialized()) {
            try {
              await GDrive.files
                .download(url, {
                  toFile: path,
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                  },
                })
                .promise.then((res) => {
                  if (res.statusCode == 200 && res.bytesWritten > 0) {
                    contentFileFromGDrive = readFile(path);
                  }
                });
            } catch (e) {
              console.log(e);
            }
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
    return contentFileFromGDrive;
  };

  const readFile = async (url) => {
    const exportedFileContent = await RNFSManager.readFile(url);
    const contentFile = JSON.parse(base64.decode(exportedFileContent));
    return contentFile;
  };

  const restore = async () => {
    setLoading(true);
    const fileExistsInCloud = await checkPrivateFileExistsInCloud();
    if (fileExistsInCloud) {
      RNCloudFs.listFiles({
        targetPath: '',
        scope: 'visible',
      }).then(async (files) => {
        let file = files.files.filter((file) => file.name.includes(targetPath));
        if (Platform.OS === 'ios') {
          let link = decodeURIComponent(file[0].uri);
          link = handleLinkDownloadIOS(link);
          await getContentFileFromIcloud(link).then((wallets) => {
            console.log('🎉 file json: ', wallets);
            restoreWallets(wallets || []);
          });
        } else {
          let link = decodeURIComponent(file[0].uri);
          const id = getGDriveFileID(link);
          await getContentFileFromGDrive(id).then((wallets) => {
            console.log('🎉 file json: ', wallets);
            restoreWallets(wallets || []);
          });
        }
      });
    } else {
      Alert.alert('File Not Found');
    }
    setLoading(false);
  };

  return (
    <View style={grid.container}>
      <SafeAreaView style={grid.wrp}>
        <ScrollView>
          <View style={grid.content}>
            <View style={s.wrp}>
              <LottieView
                autoPlay
                loop
                source={require('./man-syncing-cloud-data.json')}
                style={s.img}
              />
            </View>
            <View style={s.wrp}>
              <Text style={[typo.title, s.title]}>Restore your wallets</Text>
              <Text style={s.message}>
                If you have a cloud back-up. You can restore all of your wallets
                by clicking on the button below.
              </Text>
            </View>

            <View style={s.wrp}>
              <Button
                title="Restore"
                onPress={() => restore()}
                loading={loading}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
