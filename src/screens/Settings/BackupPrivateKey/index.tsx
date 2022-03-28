import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Switch,
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
  NativeModules,
  Alert,
  PermissionsAndroid,
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
  const [recovery, setRecovery] = useState('');

  const backup = async () => {
    // var targetPath = walletname + '/private-key.txt';
    var targetPath = 'private-key.txt';

    RNCloudFs.createFile({
      targetPath: targetPath,
      content: recovery,
      scope: 'visible',
    }).then((res)=>{
      console.log(res);
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

  const getGDriveFileID = (url) => {
    //cut header
    var headerLink = 'https://drive.google.com/file/d/';

    console.log('🚩 handle link: ', url);
    url = url.substring(headerLink.length, url.length);

    //cut footer
    url = url.substring(0, url.indexOf('/'));
    console.log('🎉 linkkk : ', url);
    return url;
  };

  const getContentFileFromIcloud = (url) => {
    console.log('🚩 url: ', url);
    var path = '';
    let dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob.config({
      //   path: dirs.DocumentDir + '/' + walletName + '/private-key.txt',
      path: dirs.DocumentDir + '/private-key.txt',
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

  const getContentFileFromGDrive = async (url) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'External Storage Write Permission',
          message: 'App needs write permission',
        },
      );
      // If WRITE_EXTERNAL_STORAGE Permission is granted
      if (granted != PermissionsAndroid.RESULTS.GRANTED) return;
    } catch (err) {
      console.warn(err);
      Alert.alert('Write permission err', err);
      return;
    }
    try {
      let dirs = RNFetchBlob.fs.dirs;
      const path = dirs.DocumentDir + '/private-key.txt';

      GoogleSignin.configure();
      await GoogleSignin.signIn();
      GoogleSignin.getTokens().then((res) => {
        if (res) {
          GDrive.setAccessToken(res.accessToken);
          GDrive.init();
          if (GDrive.isInitialized()) {
            try {
              GDrive.files
                .download(url, {
                  toFile: path,
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                  },
                })
                .promise.then((res) => {
                  console.log({ res });
                  if (res.statusCode == 200 && res.bytesWritten > 0)
                    readFile(path);
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
  };

  const getPrivateKey = async () => {
    RNCloudFs.listFiles({
      //   targetPath: walletName + '/private-key.txt'
      targetPath: '/private-key.txt',
      scope: 'visible',
    }).then(async (files) => {
      console.log(files);
      var link = decodeURIComponent(files.files[files.files.length-1].uri);
      if (Platform.OS === 'ios') {
        link = handleLinkDownloadIOS(link);
        getContentFileFromIcloud(link);
      } else {
        console.log('android');
        const id = getGDriveFileID(link);
        getContentFileFromGDrive(id);
      }
    });
  };

  const readFile = async (url) => {
    const exportedFileContent = await RNFSManager.readFile(url);
    console.log('🎉 content encode: ', base64.decode(exportedFileContent));
    setRecovery(base64.decode(exportedFileContent));
  };

  return (
    <View style={grid.container}>
      <SafeAreaView style={grid.wrp}>
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
            <Button title={t('restore')} onPress={getPrivateKey} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default BackupPrivateKey;
