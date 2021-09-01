import React, { useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, Linking } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/core';
import { Portal } from 'react-native-portalize';

import { FacebookWebView } from '../../components/Modals/FacebookWebView';
import { COLORS } from '../../theme';
import { Routes } from '../../navigators/Routes';
import { spacings } from '../../theme';
import { typo } from '../../components/Styles';
import { useConfig } from '../../core/AppProvider/RemoteConfigProvider';
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
});

const Settings: React.FC = () => {
  const navigation = useNavigation();
  const refPolicy = useRef();
  const { appPrefix, links } = useConfig();

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
          <Text style={s.groupName}>Cùng Solareum</Text>
          <ListItem
            bottomDivider
            containerStyle={s.item}
            onPress={() => {
              navigation.navigate(Routes.Mission);
            }}
          >
            <Icon type="feather" name="zap" color="grey" size={16} />
            <ListItem.Content>
              <ListItem.Title style={s.itemTitle}>Điểm danh</ListItem.Title>
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
              Linking.openURL(links.wealthclub);
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
              Linking.openURL(links.twitter);
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
              Linking.openURL(links.telegram);
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
              Linking.openURL(links.solareum);
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
        <FacebookWebView ref={refPolicy} url={links.policy} />
      </Portal>
    </View>
  );
};

export default Settings;
