import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';

import Icon from '../../components/Icon';
import { spacings } from '../../theme';
import { groups } from './data';
import { MenuGroupType, MenuItemType } from './types';

const MenuItem: React.FC<MenuItemType> = ({ name, icon }) => {
  const onPressHandler = React.useCallback(() => {
    console.log('onPressHandler');
  }, []);

  return (
    <ListItem bottomDivider onPress={onPressHandler}>
      <Icon name={icon.name} color={icon.color} size={20} />
      <ListItem.Content>
        <ListItem.Title>{name}</ListItem.Title>
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
    <ScrollView>
      {groups.map((group, index) => {
        return <MenuGroup key={index} {...group} />;
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  group: {
    marginTop: spacings.xlarge,
  },
  groupName: {
    paddingHorizontal: spacings.large,
    paddingBottom: spacings.small,
    textTransform: 'uppercase',
  },
});

export default Settings;
