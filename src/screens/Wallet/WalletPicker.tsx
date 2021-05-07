import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import { Portal } from 'react-native-portalize';

import { FixedContent } from '../../components/Modals/FixedContent';

import { COLORS } from '../../theme/colors';
import Icon from '../../components/Icon';

const WalletPicker: React.FC = () => {
  const ref = useRef();

  const openWalletBook = () => {
    ref?.current?.open();
  };


  const list = [
    { title: 'List Item 1' },
    { title: 'List Item 2' },
    { title: 'List Item 3' },
    { title: 'List Item 4' },
    { title: 'List Item 5' },
  ];

  return (
    <View>
      <TouchableOpacity
        onPress={openWalletBook}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{ fontSize: 20, color: COLORS.white0 }}>{`Walltet Name`}</Text>
        <Icon name="down" color={COLORS.white0} size={16} style={{ marginLeft: 4 }} />
      </TouchableOpacity>

      <Portal>
        <FixedContent ref={ref}>
          <View style={s.content}>
            {list.map((l, i) => (
              <ListItem
                key={i}
                bottomDivider
              >
                <Icon name="Safety" size={16} color="black" />
                <ListItem.Content>
                  <ListItem.Title>{l.title}</ListItem.Title>
                </ListItem.Content>
                <Icon name="setting" size={16} color="black" />
              </ListItem>
            ))}
            <View style={s.group}>
              <View style={s.groupItem}>
                <Button title="New" type="clear" titleStyle={{ color: COLORS.dark2 }} />
              </View>
              <View style={s.groupItem}>
                <Button title="Import" type="clear" titleStyle={{ color: COLORS.dark2 }} />
              </View>
            </View>
          </View>
        </FixedContent>
      </Portal>
    </View>
  );
};

const s = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  group: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 8,
    marginLeft: -4,
    marginRight: -4,
  },
  groupItem: {
    flex: 1,
    marginLeft: 4,
    marginRight: 4,
  },
});


export default WalletPicker;
