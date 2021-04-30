import React from 'react';
import { View, Text } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

import Icon from '../../components/Icon';
import Routes from '../../navigators/Routes';

type Transaction = {
  hash: string;
  from: string;
  to: string;
  amount: number;
  fee: number;
  timestamp: number;
  nonce: number;
};

type TransactionGroup = {
  date: string;
  items: Transaction[];
};

const transactions = [
  {
    date: '2021-04-21',
    items: [
      {
        hash:
          '0x4c5b5f139aad1a83dfaa0936fb642571cdb0cbd12fcd1f398076e03bfde9ee84', // transaction hash
        from: '0x3Ed97eD0A44efa0D2230aeDc891BDe6577CBc776',
        to: '0x3Ed97eD0A44efa0D2230aeDc891BDe6577CBc776',
        amount: 123123123, // amount of
        fee: 123, // network fee / transaction fee
        timestamp: 123123123, // timestamp
        nonce: 123123, // don't know what it's yet
      },
    ],
  },
];

const TransactionItem: React.FC<Transaction> = (props) => {
  const navigation = useNavigation();
  const onPressHandler = React.useCallback(() => {
    navigation.navigate(Routes.Transaction, props);
  }, [navigation, props]);

  return (
    <ListItem bottomDivider onPress={onPressHandler}>
      <Icon name={'download'} size={20} />
      <ListItem.Content>
        <ListItem.Title>{'RECEIVED'}</ListItem.Title>
        <ListItem.Subtitle>{`FROM: ${props.from}`}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Content right>
        <ListItem.Title>{props.amount}</ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron color="grey" />
    </ListItem>
  );
};

const TransactionGroup: React.FC<TransactionGroup> = ({ date, items }) => {
  return (
    <View>
      <Text
        style={{
          paddingHorizontal: 16,
          paddingBottom: 8,
          textTransform: 'uppercase',
        }}>
        {date}
      </Text>
      {items.map((item) => (
        <TransactionItem key={item.hash} {...item} />
      ))}
    </View>
  );
};

const SendButton: React.FC = () => {
  const navigation = useNavigation();
  const onPressHandler = React.useCallback(() => {
    navigation.navigate(Routes.Send);
  }, [navigation]);

  return <Button onPress={onPressHandler} title="SendButton" />;
};

const ReceiveButton: React.FC = () => {
  const navigation = useNavigation();
  const onPressHandler = React.useCallback(() => {
    navigation.navigate(Routes.Receive);
  }, [navigation]);
  return <Button onPress={onPressHandler} title="ReceiveButton" />;
};

const CopyButton: React.FC = () => {
  const onPressHandler = React.useCallback(() => {
    console.log('onPressHandler');
  }, []);
  return (
    <>
      <Button onPress={onPressHandler} title="CopyButton" />
    </>
  );
};

const Transfers: React.FC = () => {
  return (
    <View>
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
          <CopyButton />
        </View>
      </View>
      {transactions.map((transaction) => (
        <TransactionGroup key={transaction.date} {...transaction} />
      ))}
    </View>
  );
};

export default Transfers;
