import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { SearchBar } from 'react-native-elements';

import TokensList from '../../components/TokensList';
import { grid } from '../../components/Styles';
import { COLORS } from '../../theme';
import { useApp } from '../../core/AppProvider';
import { useMarket } from '../../core/AppProvider/MarketProvider';

const Search: React.FC = ({ route }) => {
  const [query, setQuery] = useState('');
  const [tokens, setTokens] = useState([]);
  const { tokenInfos = [] } = useApp();
  const { symbolList } = useMarket();
  const { action } = route.params;

  useEffect(() => {
    const q = query.toLowerCase();
    const t = tokenInfos?.filter((i) => {
      const name = i.name ? i.name.toLowerCase() : '';
      const symbol = i.symbol ? i.symbol.toLowerCase() : '';
      return name.indexOf(q) >= 0 || symbol.indexOf(q) >= 0;
    });

    // sort token by some conditions
    const sortedList = t?.sort((a, b) => {
      let ta = symbolList.indexOf(a.symbol) >= 0 ? 100 : 0;
      let tb = symbolList.indexOf(b.symbol) >= 0 ? 100 : 0;
      if (a.name?.includes('Sollet') || a.name?.includes('Wrapped')) {
        ta = 50;
      }
      if (b.name?.includes('Sollet') || b.name?.includes('Wrapped')) {
        tb = 50;
      }
      return tb - ta;
    });

    setTokens(sortedList?.splice(0, 24) || []);
  }, [query, tokenInfos]);

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
