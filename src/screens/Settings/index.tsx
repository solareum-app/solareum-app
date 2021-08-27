import React, { useRef, useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Linking } from 'react-native';
import remoteConfig from '@react-native-firebase/remote-config';

import { ListItem, Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/core';
import { Portal } from 'react-native-portalize';

import { FacebookWebView } from '../../components/Modals/FacebookWebView';

import { COLORS } from '../../theme';
import { Routes } from '../../navigators/Routes';
import { spacings } from '../../theme';
import { typo } from '../../components/Styles';
import package from '../../../package.json';

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark2,
  },
  group: {
    marginTop: spacings.xlarge,
    backgroundColor: COLORS.dark2,
  },
  groupName: {
    paddingHorizontal: spacings.large,
    paddingBottom: spacings.small,
    color: COLORS.white2,
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
    fontSize: 14,
  },
  wrp: {
    padding: 20,
  },
});

const Settings: React.FC = () => {
  const navigation = useNavigation();
  const refPolicy = useRef();
  const [appPrefix, setAppPrefix] = useState('v');

  useEffect(() => {
    remoteConfig()
      .setDefaults({
        awesome_new_feature: 'disabled',
      })
      .then(() => remoteConfig().fetchAndActivate())
      .then((_) => {
        const prefix = remoteConfig().getValue('app_prefix');
        setAppPrefix(prefix._value);
      });
  }, []);

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
              <ListItem.Title style={s.itemWallet}>Ví Crypto</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="grey" />
          </ListItem>
        </View>

        <View style={s.group}>
          <Text style={s.groupName}>Cộng đồng</Text>
          <ListItem
            bottomDivider
            containerStyle={s.item}
            onPress={() => {
              Linking.openURL('https://wealthclub.vn');
            }}
          >
            <Icon type="antdesign" name="staro" color="grey" size={16} />
            <ListItem.Content>
              <ListItem.Title style={s.itemTitle}>WealthClub</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="grey" />
          </ListItem>

          <ListItem
            bottomDivider
            containerStyle={s.item}
            onPress={() => {
              Linking.openURL('https://twitter.com/solareum_wallet');
            }}
          >
            <Icon type="feather" name="twitter" color="grey" size={16} />
            <ListItem.Content>
              <ListItem.Title style={s.itemTitle}>Twitter</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="grey" />
          </ListItem>

          <ListItem
            bottomDivider
            containerStyle={s.item}
            onPress={() => {
              Linking.openURL('https://t.me/solareum_wallet');
            }}
          >
            <Icon type="antdesign" name="hearto" color="grey" size={16} />
            <ListItem.Content>
              <ListItem.Title style={s.itemTitle}>Telegram</ListItem.Title>
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
            <Icon type="antdesign" name="rocket1" color="grey" size={16} />
            <ListItem.Content>
              <ListItem.Title style={s.itemTitle}>
                Điều khoản sử dụng
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="grey" />
          </ListItem>

          <ListItem
            bottomDivider
            containerStyle={s.item}
            onPress={() => {
              Linking.openURL('https://solareum.app');
            }}
          >
            <Icon type="feather" name="zap" color="grey" size={16} />
            <ListItem.Content>
              <ListItem.Title style={s.itemTitle}>
                Về Solareum Wallet
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="grey" />
          </ListItem>
        </View>

        <View style={s.group}>
          <View style={s.wrp}>
            <Text style={typo.helper}>
              v{package.version}
              {appPrefix}
            </Text>
          </View>
        </View>
      </ScrollView>

      <Portal>
        <FacebookWebView
          ref={refPolicy}
          url="https://www.wealthclub.vn/t/solareum-wallet-dieu-khoan-su-dung/418"
        />
      </Portal>
    </View>
  );
};

export default Settings;
