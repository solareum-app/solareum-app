import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

import Routes from '../../navigators/Routes';

type Props = {};
const ImportWallet: React.FC<Props> = () => {
  const navigation = useNavigation();

  const onPressHandler = React.useCallback(() => {
    navigation.navigate('TabNavigator', { screen: Routes.Wallet });
  }, [navigation]);

  return (
    <View>
      <Text>{`ImportWallet`}</Text>
      <Button title="Import" onPress={onPressHandler} />
    </View>
  );
};

export default ImportWallet;
