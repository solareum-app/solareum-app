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
  Linking,
} from 'react-native';
import { Button } from 'react-native-elements';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import GDrive from 'react-native-google-drive-api-wrapper';
import base64 from 'react-native-base64';
import iCloudAccountStatus from 'react-native-icloud-account-status';
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
const APP_DIRECTORY = 'Solareum';

export const Restore: React.FC<Props> = () => {
  const { restoreWallets: restoreAllWallets } = useApp();
  const navigation = useNavigation();

  const [loading, setLoading] = useState<boolean>(false);

  const restoreWallets = async (wallets: BackupData[]) => {
    try {
      await restoreAllWallets(wallets);
    } catch {}
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

  const checkPrivateFileExitsInDrive = async () => {
    let isExists = false;
    const isSignedIn = await _isSignedIn();
    console.log('is signed in: ', isSignedIn);
    try {
      if (!isSignedIn) {
        await _signIn();
      }
      if (!(await _initGoogleDrive())) {
        setLoading(false);
        return console.log('Failed to Initialize Google Drive');
      }

      let data = await GDrive.files.list({
        q: GDrive._stringifyQueryParams({ trashed: false }, '', ' and ', true),
      });
      let result = await data.json();
      result.files.forEach((file) => {
        if (file.name === APP_DIRECTORY) {
          isExists = true;
          return;
        }
      });
    } catch (error) {
      console.log('Error->', error);
    }

    console.log('file exists: ', isExists);

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

  const checkIcloudAccountStatus = () => {
    // ignore android
    if (Platform.OS !== 'ios') {
      return true;
    }

    // check for ios only
    return iCloudAccountStatus
      .getStatus()
      .then((accountStatus) => {
        if (accountStatus === iCloudAccountStatus.STATUS_AVAILABLE) {
          return true;
        } else {
          Alert.alert(
            'Sign in to iCloud',
            'You need to sign in iCloud to perform this action',
            [
              {
                text: 'Go to Settings',
                onPress: () => Linking.openURL('App-Prefs:'),
              },
            ],
            { cancelable: true },
          );
          return false;
        }
      })
      .catch(() => {
        return false;
      });
  };

  const restore = async () => {
    const icloudStatus = await checkIcloudAccountStatus();
    if (!icloudStatus) {
      return;
    }
    setLoading(true);
    const fileExistsInCloud =
      Platform.OS === 'ios'
        ? await checkPrivateFileExistsInCloud()
        : await checkPrivateFileExitsInDrive();
    if (fileExistsInCloud) {
      if (Platform.OS === 'android') {
        if (!(await _initGoogleDrive())) {
          setLoading(false);
          return Alert.alert('Failed to Initialize Google Drive');
        }
        let data = await GDrive.files.list({
          q: GDrive._stringifyQueryParams(
            { trashed: false, mimeType: 'application/json' },
            '',
            ' and ',
            true,
          ),
        });
        let result = await data.json();
        console.log('🎉 private-key: ', result);
        let id = result.files[0].id;
        await getContentFileFromGDrive(id).then((wallets) => {
          console.log('🎉 file json: ', wallets);
          restoreWallets(wallets || []);
        });
      } else {
        RNCloudFs.listFiles({
          targetPath: '',
          scope: 'visible',
        }).then(async (files) => {
          let file = files.files.filter((file) =>
            file.name.includes(targetPath),
          );
          if (Platform.OS === 'ios') {
            let link = decodeURIComponent(file[0].uri);
            link = handleLinkDownloadIOS(link);
            await getContentFileFromIcloud(link).then((wallets) => {
              console.log('🎉 file json: ', wallets);
              restoreWallets(wallets || []);
            });
          }
        });
      }
    } else {
      Alert.alert('File Not Found');
    }
    setLoading(false);
  };

  const _isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      console.log('User is already signed in');
      // Get User Info if user is already signed in
      try {
        let info = await GoogleSignin.signInSilently();
        console.log('User Info --> ', info);
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_REQUIRED) {
          console.log('User has not signed in yet');
        } else {
          console.log("Unable to get user's info", error);
        }
      }
    }
    return isSignedIn;
  };

  const _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        // Check if device has Google Play Services installed
        // Always resolves to true on iOS
        showPlayServicesUpdateDialog: true,
      });
      GoogleSignin.configure();
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info --> ', userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('error.message', JSON.stringify(error));
      }
    }
  };

  const _initGoogleDrive = async () => {
    // Getting Access Token from Google
    let token = await GoogleSignin.getTokens();
    if (!token) {
      return console.log('Failed to get token');
    }
    console.log('res.accessToken =>', token.accessToken);
    // Setting Access Token
    GDrive.setAccessToken(token.accessToken);
    // Initializing Google Drive and confirming permissions
    GDrive.init();
    // Check if Initialized
    return GDrive.isInitialized();
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
