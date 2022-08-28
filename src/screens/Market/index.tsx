import { grid } from '@Components/Styles';
import { useLocalize } from '@Core/AppProvider/LocalizeProvider';
import { MarketInfo, useMarket } from '@Core/AppProvider/MarketProvider';
import { MarketItem } from '@Screens/Market/MarketItem';
import Header from '@Screens/Wallet/Header';
import { COLORS } from '@Theme/index';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SearchBar } from 'react-native-elements';

export const Market: React.FC = () => {
  const [query, setQuery] = useState('');
  const { marketList } = useMarket();
  const { t } = useLocalize();
  const [markets, setMarkets] = useState<MarketInfo[]>(marketList);

  useEffect(() => {
    const q = query.toLowerCase();
    const filteredList = marketList?.filter((i) => {
      const name = i.name ? i.name.toLowerCase() : '';
      return name.indexOf(q) >= 0;
    });

    setMarkets(filteredList);
  }, [query, marketList]);

  return (
    <View style={grid.container}>
      <Header />
      <SearchBar
        onChangeText={setQuery}
        value={query}
        placeholder={t('market-placeholder')}
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
