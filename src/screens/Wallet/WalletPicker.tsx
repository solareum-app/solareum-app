import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import { Portal } from 'react-native-portalize';
import { useNavigation } from '@react-navigation/native';

import { FixedContent } from '../../components/Modals/FixedContent';
import WalletFactory from '../../factory/Wallet';

import { COLORS, FONT_SIZES } from '../../theme';
import Routes from '../../navigators/Routes';
import Icon from '../../components/Icon';

const getShortPublicKey = (key: string) => {
  const visible = 7;
  return `${key.slice(0, visible)}...${key.slice(key.length - visible, key.length)}`;
};

const WalletPicker: React.FC = () => {
  const ref = useRef();
  const [count, setCount] = useState(0);
  const navigation = useNavigation();
  const [walletList, setWalletList] = useState([]);

  useEffect(() => {
    setWalletList(WalletFactory.getList());
  }, [count]);

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          ref?.current?.open();
          setCount(i => i + 1);
        }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: 12,
          paddingRight: 12,
        }}>
        <Text style={{ fontSize: FONT_SIZES.md, color: COLORS.white0 }}>{`Walltet Name`}</Text>
        <Icon name="down" color={COLORS.white0} size={FONT_SIZES.md} style={{ marginLeft: 4 }} />
      </TouchableOpacity>

      <Portal>
        <FixedContent ref={ref}>
          <View style={s.content}>
            {walletList.map((l) => (
              <ListItem
                key={l.id}
                containerStyle={{
                  backgroundColor: COLORS.dark0,
                  borderBottomColor: COLORS.dark2,
                  borderBottomWidth: 2
                }}
              >
                <Icon name="wallet" size={FONT_SIZES.lg} color={COLORS.white2} />
                <ListItem.Content>
                  <ListItem.Title style={{ color: COLORS.white2 }}>{l.name || 'Solareum Wallet'}</ListItem.Title>
                  <ListItem.Title style={{ color: COLORS.white4, fontSize: 12 }}>{getShortPublicKey(l.id)}</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            ))}
            <View style={s.group}>
              <View style={s.groupItem}>
                <Button title="Tạo Ví" type="clear"
                  onPress={() => {
                    ref.current?.close();
                    navigation.navigate(Routes.CreateWallet)
                  }}
                  titleStyle={{ color: COLORS.white2 }}
                  icon={
                    <Icon
                      size={FONT_SIZES.md}
                      name="plus"
                      color={COLORS.white2}
                      style={{ marginRight: 6 }}
                    />
                  }
                />
              </View>
              <View style={s.groupItem}>
                <Button title="Khôi phục" type="clear"
                  onPress={() => {
                    ref.current?.close();
                    navigation.navigate(Routes.ImportWallet)
                  }}
                  titleStyle={{ color: COLORS.white2 }}
                  icon={
                    <Icon
                      size={FONT_SIZES.md}
                      name="download"
                      color={COLORS.white2}
                      style={{ marginRight: 6 }}
                    />
                  }
                />
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
