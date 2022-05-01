  import React, { useEffect, useState, useRef } from 'react';
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
  import {
    GoogleSignin,
    statusCodes,
  } from '@react-native-google-signin/google-signin';
  import GDrive from 'react-native-google-drive-api-wrapper';
  import base64 from 'react-native-base64';
  import RNFetchBlob from 'rn-fetch-blob';
  import moment from 'moment';
  import iCloudAccountStatus from 'react-native-icloud-account-status';
  import { Portal } from 'react-native-portalize';

  import { useApp } from '../../../core/AppProvider/AppProvider';
  import { typo } from '../../../components/Styles';
  import { useLocalize } from '../../../core/AppProvider/LocalizeProvider';
  import { BackupData, mergeWallets } from './mergeWallets';
  import {
    getParamsInURL,
    updateQueryStringParameter,
  } from '../../../utils/handleLink';
  import { FixedContent } from '../../../components/Modals/FixedContent';
  import { BackupInfo } from './BackupInfo';

  const { RNFSManager, RNCloudFs } = NativeModules;

  const s = StyleSheet.create({
    backupSection: {
      marginTop: 24,
      marginBottom: 12,
    },
    backupBtn: {
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

  const targetPath = 'private-key.json';
  const APP_DIRECTORY = 'Solareum';

  export const Backup: React.FC = () => {
    const { t } = useLocalize();
    const { addressList } = useApp();

    const refBackup = useRef();
    const [lastTimeBackUp, setLastTimeBackUp] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [done, setDone] = useState<boolean>(false);

    const onRequestClose = () => {
      setLoading(false);
      setDone(false);
      refBackup.current.close();
    };

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

    const checkPrivateFileExitsInDrive = async () => {
      let isExists = false;
      const isSignedIn = await _isSignedIn();
      try {
        if (!isSignedIn) {
         await _signIn();
        }
        if (!(await _initGoogleDrive())) {
          setLoading(false)
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

    const pushFileToCloud = async (file) => {
      let icloudStatus = await checkIcloudAccountStatus();
      await RNCloudFs.createFile({
        targetPath: targetPath,
        content: file,
        scope: 'visible',
      });
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
        } else if (
          error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
        ) {
          console.log('Play Services Not Available or Outdated');
        } else {
          console.log('error.message', JSON.stringify(error));
        }
      }
    };
     

    const _initGoogleDrive = async () => {
      // Getting Access Token from Google
      let token = await GoogleSignin.getTokens();
      if (!token) return console.log('Failed to get token');
      console.log('res.accessToken =>', token.accessToken);
      // Setting Access Token
      GDrive.setAccessToken(token.accessToken);
      // Initializing Google Drive and confirming permissions
      await GDrive.init()
      // Check if Initialized
      return GDrive.isInitialized();
    };

    const _getAllFilesList = async () => {
      const isSignedIn = _isSignedIn();
      try {
        if (!isSignedIn) {
          _signIn();
        }
        if (!(await _initGoogleDrive())) {
          setLoading(false)
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
        return result;
      } catch (error) {
        console.log('Error->', error);
      }
    };

    const pushFileToDrive = async (file) => {
      try {
        console.log('🎉 upload drive data');
        // Create Directory on Google Device
        let directoryId = await GDrive.files.safeCreateFolder({
          name: APP_DIRECTORY,
          parents: ['root'],
        });
        // Check upload file response for success
        let result = await GDrive.files.createFileMultipart(
          file,
          'application/json',
          {
            parents: [directoryId],
            name: targetPath,
          },
          false,
        );
        // Check upload file response for success
        if (!result.ok) return Alert.alert('Uploading Failed');
        // Getting the uploaded File Id
      } catch (error) {
        console.log('Error->', error);
      }
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

    const backup = async () => {
      const icloudStatus = await checkIcloudAccountStatus();
      if (!icloudStatus) {
        return;
      }

      setLoading(true);
      setDone(false);
      const walletData = getBackupData();
      const fileExists =
        Platform.OS === 'ios'
          ? await checkPrivateFileExistsInCloud()
          : await checkPrivateFileExitsInDrive();

      if (!fileExists) {
        // Case have not backed up
        if (Platform.OS === 'ios') {
          await pushFileToCloud(JSON.stringify(walletData));
        } else {
         await  pushFileToDrive(JSON.stringify(walletData));
        }
      } else {
        if (Platform.OS === 'android') {
          let files = await _getAllFilesList();
          if (files){
            const id = files.files[0].id;
            // Dont sync with old file
            const oldWallet = await getContentFileFromGDrive(id);
            console.log('🎉 wallet data: ', walletData);
            const newData = JSON.stringify(mergeWallets(walletData, []));
            await GDrive.files.delete(id);
            await pushFileToDrive(newData);
            getLastTimeBackup();
            
          }else {
            Alert.alert("Backup is failed")
            setLoading(false);
            setDone(false);
              return

          }
         
        } else {
        RNCloudFs.listFiles({
          targetPath: '',
          scope: 'visible',
        }).then(async (files) => {
          if (files.files.length > 0) {
            let file = files.files.filter((file) =>
              file.name.includes(targetPath),
            );
            // ios
            // Dont sync with old file
            // let link = decodeURIComponent(file[0].uri);
            // link = handleLinkDownloadIOS(link);
            // const oldWallet = await getContentFileFromIcloud(link);
            console.log('🎉 wallet data: ', walletData);

            const newData = JSON.stringify(mergeWallets(walletData, []));
            await RNCloudFs.removeICloudFile(file[0].path);
            await pushFileToCloud(newData);
            getLastTimeBackup();
          }
        });
      }
    }

      setLoading(false);
      setDone(true);
    };


    const getLastBackUpFileDrive = async (fileId,accessToken) => {
      const url = "https://www.googleapis.com/drive/v2/files/" + fileId
     await fetch(url,{ method: 'GET',
      headers: {
        "Authorization": 'Bearer ' + accessToken,
          "Accept": 'application/json',
          "Content-Type": 'application/json',
      }}).then((response) =>{
        response.json().then(data => ({
          data: data,
          status: response.status
      })).then(res => {
var momentDateFormatted = moment(res.data.modifiedDate).format(
  'MMM DD, YYYY hh:mm:ss',
);
setLastTimeBackUp(momentDateFormatted);


      })        
      })
    }
  
    const getLastTimeBackup = async () => {
      const fileExistsInCloud = Platform.OS === "ios"?  await checkPrivateFileExistsInCloud(): await checkPrivateFileExitsInDrive();
      if (!fileExistsInCloud) {
        setLastTimeBackUp('');
      } else {
        if (Platform.OS === "ios"){
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
        }else {
          let data = await GDrive.files.list({
            q: GDrive._stringifyQueryParams(
                {trashed: false,mimeType: "application/json"}, '', ' and ', true
               ),
          }); 
          let result = await data.json();
          let id = result.files[0].id;
          let token = await GoogleSignin.getTokens();
          getLastBackUpFileDrive(id, token.accessToken)
        
        }
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
            type="outline"
            onPress={() => {
              refBackup.current.open();
            }}
          />
        </View>

        <View style={s.footer}>
          <Text style={typo.normal}>
            Last backup on: {lastTimeBackUp === null ? '-' : lastTimeBackUp}
          </Text>
        </View>

        <Portal>
          <FixedContent ref={refBackup}>
            <BackupInfo
              backup={backup}
              loading={loading}
              done={done}
              onRequestClose={onRequestClose}
            />
          </FixedContent>
        </Portal>
      </View>
    );
  };
