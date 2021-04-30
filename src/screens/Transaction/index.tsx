import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

type TransactionPropertyProps = {
  label: string;
  value: string;
};
const TransactionProperty: React.FC<TransactionPropertyProps> = ({
  label,
  value,
}) => {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const Transaction: React.FC = () => {
  return (
    <ScrollView>
      <TransactionProperty label="Status" value="Success" />
      <TransactionProperty label="Transfer Amount" value="1.39275112 BNB" />
      <TransactionProperty
        label="Transaction Hash"
        value="0x55c8a4f5744713ed7c892de24584971fe0176f12d710861f54f9409263fdfc78"
      />
      <TransactionProperty
        label="From Address"
        value="0x3ed97ed0a44efa0d2230aedc891bde6577cbc776"
      />
      <TransactionProperty
        label="To Address"
        value="0x3ed97ed0a44efa0d2230aedc891bde6577cbc776"
      />
      <TransactionProperty label="Network Fee" value="0.00084054" />
      <TransactionProperty label="Timestamp" value="" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  group: {
    marginHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 20,
    paddingVertical: 8,
  },
  value: {
    fontSize: 16,
  },
});

export default Transaction;
