import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Button,
  Platform,
  Alert,
  PermissionsAndroid,
  NativeModules,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/core';

import { ImageCached } from '../../components/ImageCached/ImageCached';
import Routes from '../../navigators/Routes';
import { AddressInfo } from '../../storage/WalletCollection';
import { useApp } from '../../core/AppProvider/AppProvider';
import { grid } from '../../components/Styles';
import { COLORS } from '../../theme';
import walletIcon from '../../assets/XSB-S.png';
import walletIconActive from '../../assets/XSB-P.png';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';
import { BackupData, mergeWallets } from './BackupPrivateKey/mergeWallets';
import { getParamsInURL, updateQueryStringParameter } from '../../utils/handleLink';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import GDrive from 'react-native-google-drive-api-wrapper';
import base64 from 'react-native-base64';
import RNFetchBlob from 'rn-fetch-blob';

const { RNFSManager, RNCloudFs } = NativeModules;


const s = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: COLORS.dark0,
    borderColor: COLORS.dark0,
    marginBottom: 12,
  },
  iconLeft: {
    width: 48,
    height: 48,
    marginRight: 16,
    flex: 0,
    position: 'relative',
  },
  walletIcon: {
    width: 48,
    height: 48,
    borderRadius: 48,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.dark2,
  },
  walletIconActive: {
    borderColor: COLORS.success,
  },
  checkItem: {
    position: 'absolute',
    top: -4,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 20,
    padding: 2,
    backgroundColor: COLORS.success,
  },
  iconRight: {
    flex: 0,
    padding: 12,
  },
  title: {
    color: COLORS.white2,
    fontSize: 18,
    lineHeight: 24,
    flex: 1,
  },
  wrp: {
    marginBottom: 12,
  },
});

type Props = {
  active?: boolean;
  item: AddressInfo;
  onSelect: any;
};

const WalletItem: React.FC<Props> = ({ active, item, onSelect }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={s.main} onPress={onSelect}>
      <View style={s.iconLeft}>
        <ImageCached
          source={active ? walletIconActive : walletIcon}
          style={[s.walletIcon, active ? s.walletIconActive : {}]}
        />
      </View>
      <Text style={s.title}>{item.name}</Text>
      <TouchableOpacity
        style={s.iconRight}
        onPress={() => {
          navigation.navigate(Routes.EditWallet, { address: item });
        }}
      >
        <Icon type="feather" name="info" color={COLORS.white4} size={16} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export const Wallet: React.FC = () => {
  const { addressId, setAddressId, addressList } = useApp();
  const navigation = useNavigation();
  const { t } = useLocalize();
  const targetPath = 'private-key.json';


  const onSelect = (id: string) => {
    setAddressId(id);
    navigation.navigate(Routes.Wallet);
  };


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
        <ScrollView>
          <View style={grid.content}>
            {addressList.map((i) => {
              return (
                <WalletItem
                  key={i.id}
                  active={i.id === addressId}
                  item={i}
                  onSelect={() => onSelect(i.id)}
                />
              );
            })}
          </View>
          <View style={s.wrp}>
              <Button title={t('back-up')} onPress = {backup} />
            </View>

            <View style={s.wrp}>
              <Button title={t('restore')} onPress = {restore}/>
            </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
