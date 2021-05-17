import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Header as HeaderElement } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

import { COLORS } from '../../theme/colors';
import Icon from '../../components/Icon';
import Routes from '../../navigators/Routes';
import WalletPicker from './WalletPicker';

const SettingIcon: React.FC = () => {
  const navigation = useNavigation();

  const onPressHandler = React.useCallback(() => {
    navigation.navigate(Routes.Settings);
  }, [navigation]);

  return (
    <TouchableOpacity
      style={{ paddingRight: 16 }}
      onPress={onPressHandler}
    >
      <Icon name="setting" color={COLORS.white2} size={20} />
    </TouchableOpacity>
  );
};

const NotificationIcon: React.FC = () => {
  const navigation = useNavigation();

  const onPressHandler = React.useCallback(() => {
    navigation.navigate(Routes.Notifications);
  }, [navigation]);

  return (
    <TouchableOpacity
      style={{ paddingLeft: 16 }}
      onPress={onPressHandler}
    >
      <Icon name="bells" color={COLORS.white2} size={20} />
    </TouchableOpacity >
  )
};

const Header: React.FC = () => {
  return (
    <HeaderElement
      leftComponent={<SettingIcon />}
      centerComponent={<WalletPicker />}
      rightComponent={<NotificationIcon />}
      containerStyle={{
        backgroundColor: COLORS.dark2,
        borderBottomColor: COLORS.dark4
      }}
    />
  );
};

export default Header;
