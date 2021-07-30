import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Header as HeaderElement, Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

import { COLORS } from '../../theme/colors';
import Routes from '../../navigators/Routes';
import WalletPicker from './WalletPicker';

const s = StyleSheet.create({
  setting: {
    padding: 2,
    paddingRight: 16,
    opacity: 0.75,
  },
  notification: {
    padding: 2,
    paddingLeft: 16,
    opacity: 0.75,
  },
  icon: {
    opacity: 0.7,
  },
  container: {
    backgroundColor: COLORS.dark2,
    borderBottomColor: COLORS.dark4,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerLeft: {
    paddingVertical: 8,
  },
  containerRight: {
    paddingVertical: 8,
  },
});

const SettingIcon: React.FC = () => {
  const navigation = useNavigation();

  const onPressHandler = React.useCallback(() => {
    navigation.navigate(Routes.Settings);
  }, [navigation]);

  return (
    <TouchableOpacity style={s.setting} onPress={onPressHandler}>
      <Icon
        type="feather"
        name="hexagon"
        color={COLORS.white2}
        size={20}
        style={s.icon}
      />
    </TouchableOpacity>
  );
};

const NotificationIcon: React.FC = () => {
  const navigation = useNavigation();

  const onPressHandler = React.useCallback(() => {
    navigation.navigate(Routes.Notifications);
  }, [navigation]);

  return (
    <TouchableOpacity style={s.notification} onPress={onPressHandler}>
      <Icon
        type="feather"
        name="message-square"
        color={COLORS.white2}
        size={20}
        style={s.icon}
      />
    </TouchableOpacity>
  );
};

const Header: React.FC = () => {
  return (
    <HeaderElement
      leftComponent={<SettingIcon />}
      centerComponent={<WalletPicker />}
      rightComponent={<NotificationIcon />}
      containerStyle={s.container}
      leftContainerStyle={s.containerLeft}
      rightContainerStyle={s.containerRight}
    />
  );
};

export default Header;
