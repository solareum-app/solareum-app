import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Portal } from 'react-native-portalize';

import { FacebookWebView } from '../../components/Modals/FacebookWebView';
import { grid, typo } from '../../components/Styles';
import Routes from '../../navigators/Routes';
import imgEducation from '../../assets/clip-education.png';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';

const s = StyleSheet.create({
  wrp: {
    marginBottom: 12,
  },
  placeholderImage: {
    width: 280,
    height: 140,
    marginBottom: 16,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 40,
  },
  message: {
    ...typo.normal,
    marginBottom: 8,
  },
  title: { textAlign: 'left' },
  group: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: -6,
    marginRight: -6,
  },
  groupButton: {
    flex: 1,
    marginLeft: 6,
    marginRight: 6,
  },
});

type Props = {};
const GetStarted: React.FC<Props> = () => {
  const navigation = useNavigation();
  const refPolicy = useRef();
  const { t } = useLocalize();

  const createWalletHandler = React.useCallback(() => {
    navigation.navigate(Routes.CreateWallet);
  }, [navigation]);

  const importWalletHandler = React.useCallback(() => {
    navigation.navigate(Routes.ImportWallet);
  }, [navigation]);

  return (
    <View style={grid.container}>
      <SafeAreaView style={grid.wrp}>
        <ScrollView>
          <View style={grid.content}>
            <View style={s.wrp}>
              <Image source={imgEducation} style={s.placeholderImage} />
            </View>
            <View style={s.wrp}>
              <Text style={[typo.title, s.title]}>{t('started-title')}</Text>
              <Text style={s.message}>{t('started-message-01')}</Text>
              <Text style={s.message}>{t('started-message-02')}</Text>
              <Text style={s.message}>{t('started-message-03')}</Text>
            </View>
            <View style={s.wrp}>
              <Button
                title={t('started-terms')}
                type="clear"
                onPress={() => {
                  refPolicy.current.open();
                }}
                style={grid.button}
              />
            </View>
            <View style={s.wrp}>
              <Button
                title={t('started-create-wallet')}
                style={grid.button}
                onPress={createWalletHandler}
              />
            </View>
            <View style={s.group}>
              <View style={s.groupButton}>
                <Button
                  title="Restore"
                  type="outline"
                  style={grid.button}
                  onPress={() => {
                    navigation.navigate(Routes.Restore);
                  }}
                />
              </View>
              <View style={s.groupButton}>
                <Button
                  title={t('started-import-wallet')}
                  type="outline"
                  style={grid.button}
                  onPress={importWalletHandler}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Portal>
        <FacebookWebView ref={refPolicy} url={t('started-terms-url')} />
      </Portal>
    </View>
  );
};

export default GetStarted;
