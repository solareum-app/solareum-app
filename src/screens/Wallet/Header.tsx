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
      <Icon type="feather" name="settings" color={COLORS.white4} size={20} />
    </TouchableOpacity>
  );
};

const BackIcon: React.FC = () => {
  const navigation = useNavigation();

  const onPressHandler = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <TouchableOpacity style={s.notification} onPress={onPressHandler}>
      <Icon type="feather" name="arrow-left" color={COLORS.white4} size={20} />
    </TouchableOpacity>
  );
};

const Header: React.FC = ({ isBack }) => {
  return (
    <HeaderElement
      leftComponent={isBack ? <BackIcon /> : null}
      centerComponent={<WalletPicker />}
      rightComponent={<SettingIcon />}
      containerStyle={s.container}
      leftContainerStyle={s.containerLeft}
      rightContainerStyle={s.containerRight}
    />
  );
};

export default Header;
