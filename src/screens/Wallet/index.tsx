import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

// import { SendButton } from '../../components/ActionButtons';
import Icon from '../../components/Icon';
import TokensList from '../../components/TokensList';
import Routes from '../../navigators/Routes';
import Header from './Header';

const SendButton: React.FC = () => {
  const navigation = useNavigation();
  const onPressHandler = React.useCallback(() => {
    navigation.navigate(Routes.TokensListed, { action: 'send' });
  }, [navigation]);

  return (
    <View style={{ alignItems: 'center' }}>
      <Button
        buttonStyle={{ width: 64, height: 64, borderRadius: 32 }}
        icon={<Icon name="upload" size={24} color={'white'} />}
        onPress={onPressHandler}
      />
      <Text>Send</Text>
    </View>
  );
};

const ReceiveButton: React.FC = () => {
  const navigation = useNavigation();
  const onPressHandler = React.useCallback(() => {
    navigation.navigate(Routes.TokensListed, { action: 'receive' });
  }, [navigation]);
  return (
    <View style={{ alignItems: 'center' }}>
      <Button
        buttonStyle={{ width: 64, height: 64, borderRadius: 32 }}
        icon={<Icon name="download" size={24} color={'white'} />}
        onPress={onPressHandler}
      />
      <Text>Receive</Text>
    </View>
  );
};

const Wallet: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView>
        <View style={{ height: 250 }}>
          <View style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 48 }}>{'549.0 $'}</Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'flex-end',
              padding: 16,
            }}>
            <SendButton />
            <ReceiveButton />
          </View>
        </View>
        <TokensList />
      </ScrollView>
    </View>
  );
};

export default Wallet;
