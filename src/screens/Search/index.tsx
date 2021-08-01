import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { SearchBar } from 'react-native-elements';

import TokensList from '../../components/TokensList';
import { grid } from '../../components/Styles';
import { useApp } from '../../core/AppProvider';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const { tokenInfos = [] } = useApp();
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const q = query.toLowerCase();
    const t = tokenInfos?.filter((i) => {
      const name = i.name ? i.name.toLowerCase() : '';
      const symbol = i.symbol ? i.symbol.toLowerCase() : '';
      return name.indexOf(q) >= 0 || symbol.indexOf(q) >= 0;
    });
    setTokens(t?.splice(0, 24) || []);
  }, [query, tokenInfos]);

  return (
    <View style={grid.container}>
      <SearchBar onChangeText={setQuery} value={query} />
      <ScrollView>
        <TokensList balanceListInfo={tokens} />
      </ScrollView>
    </View>
  );
};

export default Search;
