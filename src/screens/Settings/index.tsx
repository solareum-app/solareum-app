import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';

import { COLORS } from '../../theme/colors';
import Icon from '../../components/Icon';
import { spacings } from '../../theme';
import { groups } from './data';
import { MenuGroupType, MenuItemType } from './types';

const MenuItem: React.FC<MenuItemType> = ({ name, icon }) => {
  const onPressHandler = React.useCallback(() => {
    console.log('onPressHandler');
  }, []);

  return (
    <ListItem
      bottomDivider
      onPress={onPressHandler}
      containerStyle={styles.item}
    >
      <Icon name={icon.name} color={icon.color} size={20} />
      <ListItem.Content>
        <ListItem.Title style={styles.itemTitle}>{name}</ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron color="grey" />
    </ListItem>
  );
};

const MenuGroup: React.FC<MenuGroupType> = (props) => {
  return (
    <View style={styles.group}>
      {props.name !== null ? (
        <Text style={styles.groupName}>{props.name}</Text>
      ) : null}
      {props.items.map((item, index) => (
        <MenuItem key={index} {...item} />
      ))}
    </View>
  );
};

const Settings: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView>
        {groups.map((group, index) => {
          return <MenuGroup key={index} {...group} />;
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default Settings;
