import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/core';

import { Routes } from '../../navigators/Routes';
import { COLORS } from '../../theme/colors';
import { spacings } from '../../theme';

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
});

const Settings: React.FC = () => {
  const navigation = useNavigation();

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
            <Icon type="antdesign" name="Safety" color="grey" size={20} />
            <ListItem.Content>
              <ListItem.Title style={s.itemTitle}>Ví</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="grey" />
          </ListItem>
        </View>

        <View style={s.group}>
          <Text style={s.groupName}>Cộng đồng</Text>
          <ListItem bottomDivider onPress={() => null} containerStyle={s.item}>
            <Icon type="antdesign" name="staro" color="grey" size={20} />
            <ListItem.Content>
              <ListItem.Title style={s.itemTitle}>WealthClub</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="grey" />
          </ListItem>

          <ListItem bottomDivider onPress={() => null} containerStyle={s.item}>
            <Icon type="feather" name="twitter" color="grey" size={20} />
            <ListItem.Content>
              <ListItem.Title style={s.itemTitle}>Twitter</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="grey" />
          </ListItem>

          <ListItem bottomDivider onPress={() => null} containerStyle={s.item}>
            <Icon type="antdesign" name="hearto" color="grey" size={20} />
            <ListItem.Content>
              <ListItem.Title style={s.itemTitle}>Telegram</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="grey" />
          </ListItem>
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;
