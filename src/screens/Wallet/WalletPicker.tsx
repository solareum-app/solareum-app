import React from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { BottomSheet, ListItem } from 'react-native-elements';

import { COLORS } from '../../theme/colors';
import Icon from '../../components/Icon';

const WalletPicker: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  const onPressHandler = React.useCallback(() => {
    setIsVisible((prevIsVisible) => !prevIsVisible);
  }, [setIsVisible]);

  const onCloseHandler = React.useCallback(() => {
    setIsVisible(false);
  }, [setIsVisible]);

  const list = [
    { title: 'List Item 1' },
    { title: 'List Item 2' },
    { title: 'List Item 3' },
    { title: 'List Item 4' },
    { title: 'List Item 5' },
    {
      title: 'Add wallet',
      containerStyle: { backgroundColor: 'blue' },
      titleStyle: { color: COLORS.white0 },
    },
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: 'red' },
      titleStyle: { color: COLORS.white0 },
      onPress: () => setIsVisible(false),
    },
  ];

  return (
    <View>
      <TouchableOpacity
        onPress={onPressHandler}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{ fontSize: 20, color: COLORS.white0 }}>{`Walltet Name`}</Text>
        <Icon name="down" color={COLORS.white0} size={16} style={{ marginLeft: 4 }} />
      </TouchableOpacity>
      <BottomSheet
        modalProps={{ onRequestClose: onCloseHandler }}
        isVisible={isVisible}
        containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.5)' }}>
        {list.map((l, i) => (
          <ListItem
            key={i}
            bottomDivider
            containerStyle={l.containerStyle}
            onPress={l.onPress}>
            <Icon name="Safety" size={16} color="black" />
            <ListItem.Content>
              <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
            </ListItem.Content>
            <Icon name="setting" size={16} color="black" />
          </ListItem>
        ))}
      </BottomSheet>
    </View>
  );
};

export default WalletPicker;
