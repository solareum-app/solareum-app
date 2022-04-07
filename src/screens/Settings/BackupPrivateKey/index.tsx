import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
  NativeModules,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import { Button } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import RNFetchBlob from 'rn-fetch-blob';
import { grid, typo } from '../../../components/Styles';
import { useLocalize } from '../../../core/AppProvider/LocalizeProvider';
import { COLORS } from '../../../theme/colors';
import { FONT_SIZES, LINE_HEIGHT } from '../../../theme/sizes';
import base64 from 'react-native-base64';
import {
  getParamsInURL,
  updateQueryStringParameter,
} from '../../../utils/handleLink';

import GDrive from 'react-native-google-drive-api-wrapper';
import { useApp } from '../../../core/AppProvider/AppProvider';
import { BackupData, mergeWallets } from './mergeWallets';

const { RNFSManager, RNCloudFs } = NativeModules;

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

const BackupPrivateKey: React.FC = ({ routes }) => {
  const { t } = useLocalize();
  const { addressList } = useApp();

  const [recovery, setRecovery] = useState('');
  const targetPath = 'private-key.json';

  // back up data from this function to server
  const getBackupData = (): BackupData[] => {
    const backupData = addressList.map((i) => ({
      publicKey: i.address || '-',
      privateKey: i.mnemonic,
      name: i.name,
    }));
    console.log("getBackupData: ",backupData)  
    return backupData;
  };

  // check file exists in cloud 
  const checkPrivateFileExistsInCloud = async () => {
    let isExists = true;
    await RNCloudFs.listFiles({
      targetPath: '',
      scope: 'visible',
    }).then((files) => {
      console.log('files', files);
      if (files.files.length === 0) {
        isExists = false;
      } else {
        let file = files.files.filter(file => file.name.includes(targetPath));
        if (file.length > 0){
          isExists = true;
        }
      }
    });
    return isExists;
  };

  const backup = async () => {
    const walletData = getBackupData();
    const fileExistsInCloud = await checkPrivateFileExistsInCloud();
    
    if (!fileExistsInCloud) { // Case have not backed up 
      pushFileToCloud(JSON.stringify(walletData));
    } else { 
      RNCloudFs.listFiles({
        targetPath: '',
        scope: 'visible',
      }).then(async (files) => {
        if (files.files.length > 0) {
         let file = files.files.filter(file => file.name.includes(targetPath));
            if (Platform.OS === 'android') {
              const id = getGDriveFileID(file[0].uri);
              const oldWallet = await getContentFileFromGDrive(id);
              const newData = JSON.stringify(
                mergeWallets(walletData, oldWallet),
              );
              await GDrive.files.delete(id);
              pushFileToCloud(newData);
            } else {
                let link = decodeURIComponent(file[0].uri);
                link = handleLinkDownloadIOS(link);
                const oldWallet = await getContentFileFromIcloud(link);
                const newData = JSON.stringify(
                  mergeWallets(walletData, oldWallet),
                );
               await RNCloudFs.removeICloudFile(file[0].path);
                pushFileToCloud(newData);
              }
            }
        
      });
    }
  };

  const pushFileToCloud = (file) => {
    RNCloudFs.createFile({
      targetPath: targetPath,
      content: file,
      scope: 'visible',
    }).then((res) => {
      Alert.alert("Push file success");
      console.log('new file: ', res);
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
    console.log(url)
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
        console.log('The file saved to ', res.path());
        path = res.path();
        console.log('The data in file: ', res);
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
      const path = dirs.DocumentDir +`\/${targetPath}`;
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
                  console.log("🚩 res: ",res)
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

  const restore = async () => {
    const fileExistsInCloud = await checkPrivateFileExistsInCloud();
    console.log("🚩 file exists: ",fileExistsInCloud);
if (fileExistsInCloud){
    RNCloudFs.listFiles({
      targetPath: '',
      scope: 'visible',
    }).then(async (files) => {
      let file = files.files.filter(file => file.name.includes(targetPath));
        console.log("restore file: ",file)
      if (Platform.OS === 'ios') {
            let link = decodeURIComponent(file[0].uri);
            link = handleLinkDownloadIOS(link);
            await getContentFileFromIcloud(link).then((value) => {
            console.log("🎉 file json: ",value)
            });
      } else {
        let link = decodeURIComponent(file[0].uri);
        const id = getGDriveFileID(link);
        await getContentFileFromGDrive(id).then((value) => {
          console.log("🎉 file json: ",value)
        });
      }
    })
    }else {
      Alert.alert("File private key not found")
    }
  };

  const readFile = async (url) => {
    const exportedFileContent = await RNFSManager.readFile(url);
    console.log('🎉 content encode: ', base64.decode(exportedFileContent));
    const contentFile = JSON.parse(base64.decode(exportedFileContent));
    return contentFile;
  };

  return (
    <View style={grid.container}>
      <SafeAreaView style={grid.wrp}>
        <View style={grid.content}>
          <ScrollView>
            <View style={s.wrp}>
              <Text style={s.title}>{t('import-seed-phrase')}</Text>
              <TextInput
                style={s.recoverPhrase}
                multiline={true}
                value={recovery}
                onChangeText={(text) => setRecovery(text)}
              />
              <Text style={typo.helper}>{t('import-note')}</Text>
            </View>

            <View style={s.wrp}>
              <Button title={t('back-up')} onPress={backup} />
            </View>

            <View style={s.wrp}>
              <Button title={t('restore')} onPress={restore} />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};
export default BackupPrivateKey;
