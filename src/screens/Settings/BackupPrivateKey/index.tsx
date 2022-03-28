import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useState } from 'react';
import { ScrollView, View, Switch, StyleSheet, Text, SafeAreaView, Platform, NativeModules, Alert } from 'react-native';
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
const BackupPrivateKey: React.FC = ({routes}) => {
  const { t } = useLocalize();
  const [recovery, setRecovery] = useState('');



  const backup = async () => {
    // var targetPath = walletname + '/private-key.txt';
    var targetPath = 'private-key.txt';
   
        RNCloudFs.fileExists({
            targetPath: targetPath,
          })
            .then((exists) => {
              if (!exists) {
                RNCloudFs.createFile({
                  targetPath: targetPath,
                  content: recovery,
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
    // }  
   
   
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
    console.log('🎉 linkkk : ', url);
    return url;
  };

  const getContentFile = (url) => {
    console.log('🚩 url: ', url);
    var path = '';
    let dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob.config({
    //   path: dirs.DocumentDir + '/' + walletName + '/private-key.txt',
    path: dirs.DocumentDir + '/private-key.txt',

    })
      .fetch('GET', url, {"Authorization": "ya29.A0ARrdaM-SmoVwY4DSnI-dzhodg94RQ3DEhxTdcE9L94SqnlN_jrnq-kXBPwwyy9hYMElxUPQOYjrJjdjMIz0iTCTKH8Iyeq1II_pG98tJyh4udqbHF2Qun513G_nQ6zi1WVN0ll6O-f9zRvSY1pkBbmUxbCvA"})
      .then((res) => {
        console.log('The file saved to ', res.path());
        path = res.path();
        console.log('The data in file: ', res);
        readFile(path);
      });
  };


  const getContentFileFromGDrive = (url) =>{
    GoogleSignin.getTokens().then((res) => {
        if (res){
            GDrive.setAccessToken(res.accessToken);
            GDrive.init();
            GDrive.files
            .download(url, {
              toFile: `${RNFSManager.DocumentDirectoryPath}/private-key.txt`,
              method: 'POST',
              headers: {
                Accept: 'application/json',
              },
            })
            .promise.then((res) => {
              console.log({res});
              if (res.statusCode == 200 && res.bytesWritten > 0)
                Alert.alert('File download successful');
            });
        }
    })
  };

  const getPrivateKey = async () => {
    RNCloudFs.listFiles({
    //   targetPath: walletName + '/private-key.txt',
      targetPath:  '/private-key.txt',
      scope: 'visible',
    }).then(async (files) => {
      console.log(files);
      var link = decodeURIComponent(files.files[0].uri);
      if (Platform.OS === 'ios') {
        link = handleLinkDownloadIOS(link);
        getContentFile(link);

      } else {
        link = handleLinkDownloadGoogleDrive(link);
        console.log(link);
        // getContentFileFromGDrive(link)

        // link =
        //   'https://www.googleapis.com/drive/v3/files/1RK9VU3s4sBnlkiIMoFvHByypGOm4sduS?alt=media&source=downloadUrl';
      }
    });
  };

  const readFile = async (url) => {
    const exportedFileContent = await RNFSManager.readFile(url);
    console.log('🎉 content encode: ', base64.decode(exportedFileContent));
    setRecovery( base64.decode(exportedFileContent))
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
            <Button title={t('back-up')}
            onPress = {backup} />
          </View>

          <View style={s.wrp}>
            <Button title={t('restore')} 
            onPress = {getPrivateKey} />
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default BackupPrivateKey;
