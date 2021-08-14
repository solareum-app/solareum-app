import React, { useRef } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
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
  itemTitle: {
    color: COLORS.white2,
  },
  wrp: {
    padding: 20,
  },
});

const Settings: React.FC = () => {
  const navigation = useNavigation();
  const refPolicy = useRef();

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
              <ListItem.Title style={s.itemTitle}>Ví</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="grey" />
          </ListItem>
        </View>

        <View style={s.group}>
          <Text style={s.groupName}>Cộng đồng</Text>
          <ListItem bottomDivider onPress={() => null} containerStyle={s.item}>
            <Icon type="antdesign" name="staro" color="grey" size={16} />
            <ListItem.Content>
              <ListItem.Title style={s.itemTitle}>WealthClub</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="grey" />
          </ListItem>

          <ListItem bottomDivider onPress={() => null} containerStyle={s.item}>
            <Icon type="feather" name="twitter" color="grey" size={16} />
            <ListItem.Content>
              <ListItem.Title style={s.itemTitle}>Twitter</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="grey" />
          </ListItem>

          <ListItem bottomDivider onPress={() => null} containerStyle={s.item}>
            <Icon type="antdesign" name="hearto" color="grey" size={16} />
            <ListItem.Content>
              <ListItem.Title style={s.itemTitle}>Telegram</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="grey" />
          </ListItem>

          <ListItem
            bottomDivider
            onPress={() => {
              refPolicy.current.open();
            }}
            containerStyle={s.item}
          >
            <Icon type="antdesign" name="rocket1" color="grey" size={16} />
            <ListItem.Content>
              <ListItem.Title style={s.itemTitle}>
                Điều khoản sử dụng
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="grey" />
          </ListItem>
        </View>

        <View style={s.group}>
          <View style={s.wrp}>
            <Text style={typo.helper}>v{package.version}</Text>
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
