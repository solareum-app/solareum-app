import { typo } from '@Components/Styles';
import Routes from '@Navigators/Routes';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '@Theme/colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';

const s = StyleSheet.create({
  main: {
    borderWidth: 1,
    borderColor: '#9945FF',
    borderRadius: 4,
    padding: 16,
  },
  buttonStyle: {
    backgroundColor: '#9945FF',
  },
  buttonIcon: {
    marginRight: 4,
  },
  title: {
    ...typo.title,
    marginBottom: 0,
  },
  helper: {
    ...typo.helper,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export const KEY_LR = 'LIGHTNING_REWARDS_07';

export const MoonPayWidget = () => {
  const navigation = useNavigation();

  return (
    <View style={s.main}>
      <Text style={s.title}>Buy SOL with Cards</Text>
      <Text style={s.helper}>Buy now, receive in a few minutes</Text>
      <Button
        title="Buy SOL Now"
        buttonStyle={s.buttonStyle}
        onPress={() => navigation.navigate(Routes.MoonPay)}
        icon={
          <Icon
            name="zap"
            type="feather"
            size={20}
            color={COLORS.white0}
            style={s.buttonIcon}
          />
        }
      />
    </View>
  );
};
