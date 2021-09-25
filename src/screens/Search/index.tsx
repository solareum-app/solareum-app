import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { SearchBar } from 'react-native-elements';

import TokensList from '../../components/TokensList';
import { grid } from '../../components/Styles';
import { COLORS } from '../../theme';
import { useToken } from '../../core/AppProvider/TokenProvider';

import { TransferAction } from '../Wallet';

const Search: React.FC = ({ route }) => {
  const [query, setQuery] = useState('');
  const [tokens, setTokens] = useState([]);
  const { accountList } = useToken();
  const { action } = route.params;

  useEffect(() => {
    const q = query.toLowerCase();
    const accountListByAction = accountList
      .filter((i) => {
        if (action === TransferAction.receive) {
          return true;
        }
        return i.publicKey;
      })
      .sort((a, b) => b.refValue - a.refValue);

    const t = accountListByAction?.filter((i) => {
      const name = i.name ? i.name.toLowerCase() : '';
      const symbol = i.symbol ? i.symbol.toLowerCase() : '';
      return name.indexOf(q) >= 0 || symbol.indexOf(q) >= 0;
    });

    // sort token by some conditions
    const sortedList = t?.sort((a, b) => {
      return b.refValue - a.refValue;
    });

    setTokens(sortedList?.splice(0, 24) || []);
  }, [query, accountList]);

  return (
    <View style={grid.container}>
      <SearchBar
        containerStyle={{ backgroundColor: COLORS.dark0 }}
        inputContainerStyle={{ backgroundColor: COLORS.dark2 }}
        placeholder="Nhập tên Tokens: SOL, XSB..."
        onChangeText={setQuery}
        value={query}
      />
      <ScrollView>
        <TokensList balanceListInfo={tokens} action={action} />
      </ScrollView>
    </View>
  );
};

export default Search;
