import React from 'react';
import { Button as RnButton } from 'react-native-elements';
import { StyleSheet } from 'react-native';

import { COLORS } from '../../theme';

const button = StyleSheet.create({
  title: {
    color: COLORS.white0,
  },
  body: {
    backgroundColor: '#2155CD',
    borderColor: '#2155CD',
    height: 52,
  },
  disabled: {
    backgroundColor: COLORS.dark2,
    opacity: 0.7,
  },
});

export const Button = ({
  title,
  disabled,
  onPress,
  loading,
}: {
  title: string;
  disabled: boolean;
  onPress: () => void;
  loading?: boolean;
}) => {
  return (
    <RnButton
      title={title}
      type="outline"
      onPress={onPress}
      disabled={disabled}
      titleStyle={button.title}
      buttonStyle={button.body}
      disabledStyle={button.disabled}
      loading={loading}
    />
  );
};
