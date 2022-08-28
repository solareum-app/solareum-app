import { FacebookWebView } from '@Components/Modals/FacebookWebView';
import { typo } from '@Components/Styles';
import { useLocalize } from '@Core/AppProvider/LocalizeProvider';
import { useConfig } from '@Core/AppProvider/RemoteConfigProvider';
import { Routes } from '@Navigators/Routes';
import { useNavigation } from '@react-navigation/core';
import { COLORS, spacings } from '@Theme/index';
import React, { useRef } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { Portal } from 'react-native-portalize';
import package from '../../../package.json';

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark2,
  },
  group: {
    backgroundColor: COLORS.dark2,
    marginBottom: 24,
  },
  groupName: {
    paddingHorizontal: spacings.large,
    paddingBottom: spacings.small,
    color: COLORS.blue4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: COLORS.dark0,
    borderBottomColor: COLORS.dark2,
  },
  itemWallet: {
    color: COLORS.white2,
  },
  itemTitle: {
    color: COLORS.white2,
    fontSize: 16,
  },
  wrp: {
    padding: 20,
  },
  panel: {
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
  },
  panelItem: {
    flex: 1,
  },
  panelLanguage: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: -8,
  },
  language: {
    textAlign: 'right',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 0,
    fontSize: 14,
    textTransform: 'uppercase',
  },
  languageActive: {
    color: COLORS.blue4,
  },
});

const Language = ({ value }) => {
  const { language, setLanguage } = useLocalize();

  return (
    <Text
      style={[
        typo.helper,
        s.language,
        language === value ? s.languageActive : {},
      ]}
      onPress={() => {
        setLanguage(value);
      }}
    >
      {value}
    </Text>
  );
};

const Settings: React.FC = () => {
  const navigation = useNavigation();
  const refPolicy = useRef();
  const { appPrefix, links } = useConfig();
  const { t, language } = useLocalize();

  return (
    <View style={s.container}>
      <ScrollView>
        <View style={s.group}>
          <ListItem
            containerStyle={s.item}
            bottomDivider
            onPress={() => {
              navigation.navigate(Routes.SettingWallet);
            }}
          >
            <Icon type="antdesign" name="wallet" color="grey" size={20} />
            <ListItem.Content>
              <ListItem.Title style={s.itemWallet}>
                {t('setting-wallet')}
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="grey" />
          </ListItem>

          <ListItem
            containerStyle={s.item}
            bottomDivider
            onPress={() => {
              navigation.navigate(Routes.ManagementTokenList);
            }}
          >
            <Icon type="feather" name="bookmark" color="grey" size={20} />
            <ListItem.Content>
              <ListItem.Title style={s.itemWallet}>
                {t('setting-manage-account')}
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="grey" />
          </ListItem>

          <ListItem
            containerStyle={s.item}
            bottomDivider
            onPress={() => {
              navigation.navigate(Routes.SwapApplication);
            }}
          >
            <Icon type="feather" name="refresh-cw" color="grey" size={20} />
            <ListItem.Content>
              <ListItem.Title style={s.itemWallet}>
                Swap Application
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="grey" />
          </ListItem>
        </View>

        <View style={s.group}>
          <Text style={s.groupName}>{t('setting-community')}</Text>

          <ListItem
            bottomDivider
            containerStyle={s.item}
            onPress={() => {
              navigation.navigate(Routes.MoonPay);
            }}
          >
            <Icon type="feather" name="zap" color="grey" size={16} />
            <ListItem.Content>
              <ListItem.Title style={s.itemTitle}>
                Buy SOL with Cards
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="grey" />
          </ListItem>

          <ListItem
            bottomDivider
            containerStyle={s.item}
            onPress={() => {
              Linking.openURL(
                `https://solareum.app/lightning-rewards/?lang=${language}`,
              );
            }}
          >
            <Icon type="feather" name="zap" color="grey" size={16} />
            <ListItem.Content>
              <ListItem.Title style={s.itemTitle}>
                Lightning Rewards
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="grey" />
          </ListItem>

          <ListItem
            bottomDivider
            containerStyle={s.item}
            onPress={() => {
              Linking.openURL(links.twitter);
            }}
          >
            <Icon type="feather" name="twitter" color="grey" size={16} />
            <ListItem.Content>
              <ListItem.Title style={s.itemTitle}>
                {t('setting-twitter')}
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="grey" />
          </ListItem>

          <ListItem
            bottomDivider
            containerStyle={s.item}
            onPress={() => {
              Linking.openURL(links.telegram);
            }}
          >
            <Icon type="antdesign" name="hearto" color="grey" size={16} />
            <ListItem.Content>
              <ListItem.Title style={s.itemTitle}>
                {t('setting-telegram')}
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="grey" />
          </ListItem>

          <ListItem
            bottomDivider
            containerStyle={s.item}
            onPress={() => {
              refPolicy.current.open();
            }}
          >
            <Icon type="feather" name="compass" color="grey" size={16} />
            <ListItem.Content>
              <ListItem.Title style={s.itemTitle}>
                {t('setting-terms-of-use')}
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="grey" />
          </ListItem>

          <ListItem
            bottomDivider
            containerStyle={s.item}
            onPress={() => {
              Linking.openURL(links.solareum);
            }}
          >
            <Icon type="feather" name="zap" color="grey" size={16} />
            <ListItem.Content>
              <ListItem.Title style={s.itemTitle}>
                {t('setting-about-solareum')}
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="grey" />
          </ListItem>
        </View>

        <View style={s.group}>
          <View style={s.panel}>
            <View style={s.panelItem}>
              <Text style={{ ...typo.helper, marginBottom: 0 }}>
                v{package.version}
                {appPrefix}
                {t('prefix')}
              </Text>
            </View>
            <View style={s.panelItem}>
              <View style={s.panelLanguage}>
                <Language value="en" />
                <Language value="vn" />
              </View>
            </View>
          </View>
          <View style={s.wrp} />
        </View>
      </ScrollView>

      <Portal>
        <FacebookWebView ref={refPolicy} url={t('started-terms-url')} />
      </Portal>
    </View>
  );
};

export default Settings;
