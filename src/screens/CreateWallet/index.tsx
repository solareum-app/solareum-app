import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-community/clipboard';

import { createWallet } from '../../storage/WalletCollection';
import { generateMnemonicAndSeed } from '../../spl-utils/wallet-account';
import Routes from '../../navigators/Routes';
import Icon from '../../components/Icon';

const Word = ({ word, order }) => {
  return (
    <Text
      style={{
        paddingHorizontal: 8,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        fontSize: 17,
      }}>
      {order}. {word}
    </Text>
  );
};

type Props = {};
const CreateWallet: React.FC<Props> = () => {
  const navigation = useNavigation();
  const [confirmed, setConfirmed] = React.useState(false);
  const [seed, setSeed] = useState('');
  const [mnemonic, setMnemonic] = useState('');

  const getSeed = async () => {
    const { seed: s, mnemonic: m } = await generateMnemonicAndSeed();
    setSeed(s);
    setMnemonic(m);
  };

  const handleCreateWallet = async () => {
    await createWallet(seed, mnemonic);
    navigation.navigate(Routes.Home, { screen: Routes.Wallet });
  };

  const copyToClipboard = () => {
    Clipboard.setString(seed);
  };

  useEffect(() => {
    getSeed();
  }, []);

  return (
    <View style={{ margin: 8, flex: 1 }}>
      <Text style={{ fontSize: 24, marginTop: 20, alignSelf: 'center' }}>
        {'Your recovery phrase'}
      </Text>
      <Text style={{ fontSize: 17, marginTop: 20 }}>
        {
          'Write down or copy the following twenty four words in the right order and save them in a safe place.'
        }
      </Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          margin: 20,
          marginBottom: 8,
        }}>
        {mnemonic
          .split(' ')
          .map((word: string, index: number) => (
            <Word key={index} word={word} order={index + 1} />
          ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Button title="Copy" onPress={copyToClipboard} />
      </View>
      <Text style={{ fontSize: 17, marginTop: 20 }}>
        {
          'Your private keys are only stored on your current device. You will need these words to restore your wallet if your device is lost, damaged or stolen.'
        }
      </Text>
      <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 32 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <View
            style={{
              flex: 0.1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name="exclamationcircleo" color="red" />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text style={{ color: 'red' }}>
              {'Never share recovery phrase with anyone, store it securely!'}
            </Text>
          </View>
        </View>
        <CheckBox
          containerStyle={{
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            marginLeft: 0,
            paddingLeft: 0,
          }}
          title="I have saved these words in a safe place."
          checked={confirmed}
          onPress={() => setConfirmed((prevConfirmed) => !prevConfirmed)}
        />
        <Button title="Create Wallet" onPress={handleCreateWallet} />
      </View>
    </View>
  );
};

export default CreateWallet;
