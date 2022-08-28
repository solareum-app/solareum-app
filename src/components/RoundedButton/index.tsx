import Icon from '@Components/Icon';
import { COLORS } from '@Theme/colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';

const s = StyleSheet.create({
  main: {
    alignItems: 'center',
  },
  button: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginBottom: 4,
    backgroundColor: COLORS.blue2,
  },
  rewards: {
    backgroundColor: '#9945FF',
  },
});

type Props = {
  onClick: any;
  title: string;
  iconName: string;
  type?: string;
  isRewards?: boolean;
};

export const RoundedButton: React.FC<Props> = ({
  onClick,
  title,
  iconName,
  type,
  isRewards = false,
}) => {
  return (
    <View style={s.main}>
      <Button
        buttonStyle={[s.button, isRewards ? s.rewards : null]}
        onPress={onClick}
        icon={
          <Icon type={type} name={iconName} size={20} color={COLORS.white0} />
        }
      />
      <Text style={{ color: COLORS.white0 }}>{title}</Text>
    </View>
  );
};
