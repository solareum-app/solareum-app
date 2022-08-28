import { FacebookWebView } from '@Components/Modals/FacebookWebView';
import { grid, typo } from '@Components/Styles';
import { useLocalize } from '@Core/AppProvider/LocalizeProvider';
import Routes from '@Navigators/Routes';
import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Button } from 'react-native-elements';
import { Portal } from 'react-native-portalize';
import imgEducation from '../../assets/clip-education.png';

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
