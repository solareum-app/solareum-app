import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, ButtonProps } from 'react-native-elements';

import Icon from '../Icon';

export type BaseButtonProps = ButtonProps & {
  text: string;
  iconName: string; // it should be a list of names from AntDesign
};

const BaseButton: React.FC<BaseButtonProps> = (props) => {
  const { text, iconName, onPress } = props;

  return (
    <View style={styles.alignItemsCenter}>
      <Button
        buttonStyle={styles.buttonStyle}
        icon={<Icon name={iconName} size={24} color={'white'} />}
        onPress={onPress}
      />
      <Text>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  alignItemsCenter: {
    alignItems: 'center',
  },
  buttonStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});

export default BaseButton;
