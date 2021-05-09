import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

import Icon from '../../components/Icon';
import { COLORS } from '../../theme/colors';

type Props = {
  onClick: any,
  title: string,
  iconName: string,
}

const s = StyleSheet.create({
  main: {
    alignItems: 'center'
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 4,
    backgroundColor: COLORS.blue2,
  }
});

export const RoundedButton: React.FC<Props> = ({ onClick, title, iconName }) => {
  return (
    <View style={s.main}>
      <Button
        buttonStyle={s.button}
        onPress={onClick}
        icon={<Icon name={iconName} size={24} color={COLORS.white0} />}
      />
      <Text style={{ color: COLORS.white0 }}>{title}</Text>
    </View>
  );
};
