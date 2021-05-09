import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

import Routes from '../../navigators/Routes';

type Props = {};
const GetStarted: React.FC<Props> = () => {
  const navigation = useNavigation();

  const createWalletHandler = React.useCallback(() => {
    navigation.navigate(Routes.CreateWallet);
  }, [navigation]);

  const importWalletHandler = React.useCallback(() => {
    navigation.navigate(Routes.ImportWallet);
  }, [navigation]);

  return (
    <View>
      <Text>{`GetStarted`}</Text>
      <Button title="Create Wallet" onPress={createWalletHandler} />
      <Button title="Import Wallet" onPress={importWalletHandler} />
    </View>
  );
};

export default GetStarted;
