import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

import { COLORS } from '../../theme/colors';
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
        buttonStyle={{
          width: 56,
          height: 56,
          borderRadius: 28,
          marginBottom: 4,
          backgroundColor: COLORS.blue2
        }}
        icon={<Icon name="upload" size={24} color={COLORS.white0} />}
        onPress={onPressHandler}
      />
      <Text style={{ color: COLORS.white0 }}>Send</Text>
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
        buttonStyle={{
          width: 56,
          height: 56,
          borderRadius: 28,
          marginBottom: 4,
          backgroundColor: COLORS.blue2
        }}
        icon={<Icon name="download" size={24} color={COLORS.white0} />}
        onPress={onPressHandler}
      />
      <Text style={{ color: COLORS.white0 }}>Receive</Text>
    </View>
  );
};

const Wallet: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView>
        <View style={{ height: 220 }}>
          <View style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 40, color: COLORS.white0 }}>{'549.52 $'}</Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'flex-end',
              padding: 16,
              width: 260,
              marginLeft: 'auto',
              marginRight: 'auto',
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
