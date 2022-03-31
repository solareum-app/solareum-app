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
import { isExists } from 'date-fns';
import { PriceContext } from '../../../core/AppProvider/PriceProvider';
var RNFS = require('react-native-fs');

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

  let dirs = RNFetchBlob.fs.dirs;
  const localPath = dirs.DocumentDir + '/private-key.json';
  var targetPath = 'private-key.json';

  const checkPrivateFileExists = async () => {
    var isExists = true;
    await RNCloudFs.listFiles({
      targetPath: '',
      scope: 'visible',
    }).then((files) => {
      if (files.files.length === 0) {
        isExists = false;
      } else {
        for (var i = 0; i < files.files.length; i++) {
          if (files.files[i].uri === null) {
            isExists = false;
          } else { 
            isExists = true;
            break;
          }
          if (files.files[i].name != "private-key.json"){
            isExists = false;
          }else{
            isExists = true;
            break;
          }
        }
      }
    });
    return isExists;
  };

  const backup = async () => {
    var content = [
      {
        publicKey: '123456',
        privateKey: 'lam quynh huong',
        name: 'baby',
      },
    ];
    const fileExists = await checkPrivateFileExists();

    if (!fileExists) {
      pushFileToCloud(JSON.stringify(content));
    } else {
      RNCloudFs.listFiles({
        //   targetPath: walletName + '/private-key.txt'
        targetPath: '',
        scope: 'visible',
      }).then(async (files) => {
        if (files.files.length > 0) {
          for (var i = 0; i < files.files.length; i++) {
              if (Platform.OS === 'android') {
                const id = getGDriveFileID(files.files[i].uri);
                await getContentFileFromGDrive(id).then((value)=>{
                  const newBackUp = {
                    publicKey: 'bao',
                    privateKey: 'huong lam',
                    name: '12345',
                  };
                  value.forEach(element => {
                    if (element["publicKey"] === newBackUp["publicKey"]){
                      const index = value.indexOf(element);
                      value.splice(index,1);
                    }
                  })
                  value.push(newBackUp);
                  content = JSON.stringify(value);
                }) 

                pushFileToCloud(content) 
                await GDrive.files.delete(id);

              } else {
                var link = decodeURIComponent(files.files[i].uri);
                link = handleLinkDownloadIOS(link);
                await  getContentFileFromIcloud(link).then((value) => {
                    const newBackUp = {
                      publicKey: 'huong',
                      privateKey: 'huong lam',
                      name: 'hello',
                    };
                    value.forEach(element => {
                      if (element["publicKey"] === newBackUp["publicKey"]){
                        const index = value.indexOf(element);
                        value.splice(index,1);
                      }
                    })
                    value.push(newBackUp);
                    content = JSON.stringify(value);
                  } );
                 RNCloudFs.removeICloudFile(files.files[i].path);
                 pushFileToCloud(content);
              }
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
      console.log('new file: ', res);
    });
  };



  const handleLinkDownloadIOS = (url) => {
    const params = getParamsInURL(url);
    // set parma K
    const paramK = params['k'].substring(2, params['k'].length - 1);
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

    url = url.substring(headerLink.length, url.length);

    //cut footer
    url = url.substring(0, url.indexOf('/'));

    return url;
  };

  const getContentFileFromIcloud = async (url) => {
    var path = ''; 
    var contentFileFromIcloud;
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
      if (granted != PermissionsAndroid.RESULTS.GRANTED) return;
    } catch (err) {
      console.warn(err);
      return;
    }
    try {
      let dirs = RNFetchBlob.fs.dirs;
      const path = dirs.DocumentDir + '/private-key.json';

      GoogleSignin.configure();
      await GoogleSignin.signIn();

      await GoogleSignin.getTokens().then(async (res) => {
        if (res) {
          GDrive.setAccessToken(res.accessToken);
          GDrive.init();
          if (GDrive.isInitialized()) {
            try {
            await  GDrive.files
                .download(url, {
                  toFile: path,
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                  },
                })
                .promise.then((res) => {
                  if (res.statusCode == 200 && res.bytesWritten > 0)
                   contentFileFromGDrive = readFile(path);
                  
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
    RNCloudFs.listFiles({
      targetPath: '',
      scope: 'visible',
    }).then(async (files) => {
      var link = decodeURIComponent(files.files[0].uri);
      if (Platform.OS === 'ios') {
        link = handleLinkDownloadIOS(link);
        await getContentFileFromIcloud(link).then((value) => {
          value.forEach(element => {
            if (element["publicKey"] === "huong"){
            setRecovery(element["privateKey"])
            }
          });
        })
      } else {
        const id = getGDriveFileID(link);
        await getContentFileFromGDrive(id).then((value)=>{
         value.forEach(element => {
          if (element["publicKey"] === "123456"){
            setRecovery(element["privateKey"])
          }
         })
       });
        
      }
    });
  };

  const readFile = async (url) => {
    const exportedFileContent = await RNFSManager.readFile(url);
    console.log('🎉 content encode: ', base64.decode(exportedFileContent));
    var contentFile = JSON.parse(base64.decode(exportedFileContent));
    return contentFile;
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
            <Button title={t('restore')} onPress={restore} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default BackupPrivateKey;
