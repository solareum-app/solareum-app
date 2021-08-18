import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { SearchBar } from 'react-native-elements';

import Header from '../Wallet/Header';
import { grid } from '../../components/Styles';
import { COLORS } from '../../theme';
import { MarketInfo, useMarket } from '../../core/AppProvider/MarketProvider';
import { MarketItem } from './MarketItem';

export const Market: React.FC = () => {
  const { marketList } = useMarket();
  const [query, setQuery] = useState('');
  const [markets, setMarkets] = useState<MarketInfo[]>(marketList);

  useEffect(() => {
    const q = query.toLowerCase();
    const t = marketList?.filter((i) => {
      const name = i.name ? i.name.toLowerCase() : '';
      return name.indexOf(q) >= 0;
    });

    setMarkets(t);
  }, [query, marketList]);

  return (
    <View style={grid.container}>
      <Header />
      <SearchBar
        onChangeText={setQuery}
        value={query}
        placeholder="Nhập SXB/SOL hay Market ID..."
        containerStyle={{ backgroundColor: COLORS.dark0 }}
        inputContainerStyle={{ backgroundColor: COLORS.dark2 }}
      />
      <ScrollView>
        {markets.map((i) => (
          <MarketItem key={i.id} item={i} />
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default Market;
