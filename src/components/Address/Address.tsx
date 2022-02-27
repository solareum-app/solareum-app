import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { COLORS } from '../../theme';

import { typo } from '../Styles';

const s = StyleSheet.create({
  main: {
    ...typo.address,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrp: {
    flex: 0,
    marginLeft: 8,
    padding: 8,
    backgroundColor: COLORS.dark4,
    borderRadius: 4,
  },
  round: {
    width: 16,
    height: 16,
    borderRadius: 16,
    backgroundColor: COLORS.success,
  },
  icon: {},
  address: {
    flex: 1,
    color: COLORS.white2,
  },
});

export const Address = ({
  copyToClipboard,
  address,
}: {
  copyToClipboard: any;
  address: string;
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const onPress = () => {
    setCopied(true);
    copyToClipboard();

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <View style={s.main}>
      <Text style={s.address}>{address}</Text>
      <TouchableOpacity style={s.iconWrp} onPress={onPress}>
        {!copied ? (
          <Icon
            size={16}
            name="copy"
            type="feather"
            style={s.icon}
            color={COLORS.white2}
          />
        ) : (
          <View style={s.round}>
            <Icon
              size={16}
              name="check"
              type="feather"
              style={s.icon}
              color={COLORS.dark2}
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};
