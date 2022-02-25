import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { SearchBar } from 'react-native-elements';

import TokensList from '../../components/TokenList';
import { grid } from '../../components/Styles';
import { COLORS } from '../../theme';
import { TransferAction } from '../Wallet';
import { useLocalize } from '../../core/AppProvider/LocalizeProvider';
import { usePrice } from '../../core/AppProvider/PriceProvider';

const PRIORITY = [
  'USDC',
  'SOL',
  'XSB',
  'BTC',
  'soETH',
  'USDT',
  'SRM',
  'KIN',
  'ATLAS',
  'POLIS',
  'DXL',
  'MER',
  'MILLI',
  'SAMO',
  'ORCA',
  'MANGO',
  '1SOL',
  'LTC',
  'LARIX',
  'STEP',
  'ABR',
  'MAPS',
  'JET',
  'SLRS',
  'THECA',
  'SLND',
];

const Search: React.FC = ({ route }) => {
  const [query, setQuery] = useState('');
  const [tokens, setTokens] = useState([]);
  const { accountList } = usePrice();
  const { t } = useLocalize();
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

    const filteredList = accountListByAction?.filter((i) => {
      const name = i.name ? i.name.toLowerCase() : '';
      const symbol = i.symbol ? i.symbol.toLowerCase() : '';
      return name.indexOf(q) >= 0 || symbol.indexOf(q) >= 0;
    });

    // sort token by some conditions
    const sortedList = filteredList?.sort((a, b) => {
      let ta = 0;
      let tb = 0;

      // move token has account to top
      if (a.mint) {
        ta = ta + a.refValue;
      }
      if (b.mint) {
        tb = ta + b.refValue;
      }

      if (PRIORITY.indexOf(a.symbol) >= 0 && !a.name.includes('Wrapped SOL')) {
        const i = PRIORITY.indexOf(a.symbol);
        ta += (24 - i) / 100 + 0.1;
      }
      if (PRIORITY.indexOf(b.symbol) >= 0 && !b.name.includes('Wrapped SOL')) {
        const i = PRIORITY.indexOf(b.symbol);
        tb += (24 - i) / 100 + 0.1;
      }

      return tb - ta;
    });

    setTokens(sortedList?.splice(0, 24) || []);
  }, [query, accountList]);

  return (
    <View style={grid.container}>
      <SearchBar
        containerStyle={{ backgroundColor: COLORS.dark0 }}
        inputContainerStyle={{ backgroundColor: COLORS.dark2 }}
        placeholder={t('search-placeholder')}
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
