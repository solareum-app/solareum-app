import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { SearchBar } from 'react-native-elements';

import TokensList from '../../components/TokensList';
import { grid } from '../../components/Styles';
import { useApp } from '../../core/AppProvider';
import { COLORS } from '../../theme';

const Search: React.FC = ({ route }) => {
  const [query, setQuery] = useState('');
  const [tokens, setTokens] = useState([]);
  const { tokenInfos = [] } = useApp();
  const { action } = route.params;

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
      <SearchBar
        onChangeText={setQuery}
        value={query}
        containerStyle={{ backgroundColor: COLORS.dark0 }}
        inputContainerStyle={{ backgroundColor: COLORS.dark2 }}
      />
      <ScrollView>
        <TokensList balanceListInfo={tokens} action={action} />
      </ScrollView>
    </View>
  );
};

export default Search;
