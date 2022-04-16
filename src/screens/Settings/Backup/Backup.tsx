import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Alert,
  PermissionsAndroid,
  NativeModules,
  Linking,
} from 'react-native';
import { Button } from 'react-native-elements';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import GDrive from 'react-native-google-drive-api-wrapper';
import base64 from 'react-native-base64';
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';
import iCloudAccountStatus from 'react-native-icloud-account-status';

import { useApp } from '../../../core/AppProvider/AppProvider';
import { typo } from '../../../components/Styles';
import { useLocalize } from '../../../core/AppProvider/LocalizeProvider';
import { BackupData, mergeWallets } from './mergeWallets';
import {
  getParamsInURL,
  updateQueryStringParameter,
} from '../../../utils/handleLink';

const { RNFSManager, RNCloudFs } = NativeModules;

const s = StyleSheet.create({
  backupSection: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 24,
    marginBottom: 12,
  },
  backupBtn: {
    width: 140,
    marginRight: 12,
  },
  restoreBtn: {
    width: 140,
    marginRight: 24,
  },
  footer: {
    marginBottom: 24,
    opacity: 0.5,
  },
});

export const Backup: React.FC = () => {
  const { t } = useLocalize();
  const { addressList } = useApp();
  const [lastTimeBackUp, setLastTimeBackUp] = useState<string>('');
  const targetPath = 'private-key.json';

  // back up data from this function to server
  const getBackupData = (): BackupData[] => {
    const backupData = addressList.map((i) => ({
      publicKey: i.address || '-',
      privateKey: i.mnemonic,
      name: i.name,
    }));
    return backupData;
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

  const pushFileToCloud = (file) => {
    RNCloudFs.createFile({
      targetPath: targetPath,
      content: file,
      scope: 'visible',
    }).then((res) => {
      console.log('res', res);
      Alert.alert('Your wallets have been back up onto the cloud.');
    });
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
    console.log('🎉 content encode: ', base64.decode(exportedFileContent));
    const contentFile = JSON.parse(base64.decode(exportedFileContent));
    return contentFile;
  };
  const restore = async () => {
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
          await getContentFileFromIcloud(link).then((value) => {
            console.log('🎉 file json: ', value);
          });
        } else {
          let link = decodeURIComponent(file[0].uri);
          const id = getGDriveFileID(link);
          await getContentFileFromGDrive(id).then((value) => {
            console.log('🎉 file json: ', value);
          });
        }
      });
    } else {
      Alert.alert('File Not Found');
    }
  };

  const backup = async () => {
    const icloudStatus = await checkIcloudAccountStatus();
    console.log('icloudStatus', icloudStatus);
    if (!icloudStatus) {
      return;
    }

    console.log('backup');
    const walletData = getBackupData();
    const fileExistsInCloud = await checkPrivateFileExistsInCloud();

    console.log('fileExistsInCloud');
    if (!fileExistsInCloud) {
      // Case have not backed up
      pushFileToCloud(JSON.stringify(walletData));
    } else {
      RNCloudFs.listFiles({
        targetPath: '',
        scope: 'visible',
      }).then(async (files) => {
        if (files.files.length > 0) {
          let file = files.files.filter((file) =>
            file.name.includes(targetPath),
          );

          // android
          if (Platform.OS === 'android') {
            const id = getGDriveFileID(file[0].uri);
            const oldWallet = await getContentFileFromGDrive(id);
            const newData = JSON.stringify(mergeWallets(walletData, oldWallet));
            await GDrive.files.delete(id);
            pushFileToCloud(newData);
            getLastTimeBackup();
          } else {
            // ios
            let link = decodeURIComponent(file[0].uri);
            link = handleLinkDownloadIOS(link);
            const oldWallet = await getContentFileFromIcloud(link);
            const newData = JSON.stringify(mergeWallets(walletData, oldWallet));
            await RNCloudFs.removeICloudFile(file[0].path);
            pushFileToCloud(newData);
            getLastTimeBackup();
          }
        }
      });
    }
  };

  const getLastTimeBackup = async () => {
    const fileExistsInCloud = await checkPrivateFileExistsInCloud();
    if (!fileExistsInCloud) {
      setLastTimeBackUp('');
    } else {
      RNCloudFs.listFiles({
        targetPath: '',
        scope: 'visible',
      }).then(async (files) => {
        let privateKeyFile = files.files.filter((file) =>
          file.name.includes(targetPath),
        );
        var momentDateFormatted = moment(privateKeyFile[0].lastModified).format(
          'MMM DD, YYYY hh:mm:ss',
        );
        setLastTimeBackUp(momentDateFormatted);
      });
    }
  };

  useEffect(() => {
    getLastTimeBackup();
  });

  return (
    <View>
      <View style={s.backupSection}>
        <Button
          title={t('back-up')}
          onPress={backup}
          buttonStyle={s.backupBtn}
        />
        <Button
          title={t('restore')}
          onPress={restore}
          type="outline"
          buttonStyle={s.restoreBtn}
        />
      </View>

      <View style={s.footer}>
        <Text style={typo.normal}>
          Last backup on: {lastTimeBackUp === null ? '-' : lastTimeBackUp}
        </Text>
      </View>
    </View>
  );
};
