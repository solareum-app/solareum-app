import React, { useMemo, useState } from 'react';
import { View, ScrollView, SafeAreaView, RefreshControl } from 'react-native';

import { ExploreList } from './List';
import { grid } from '../../components/Styles';
import { usePrice } from '../../core/AppProvider/PriceProvider';
import { COLORS } from '../../theme/colors';

import { Header } from './Header';
import { useConfig } from '../../core/AppProvider/RemoteConfigProvider';

export const Explore: React.FC = () => {
  const { accountList } = usePrice();
  const [loading, setLoading] = useState<boolean>(false);
  const { promoteTokenList } = useConfig();

  const sortedList = useMemo(() => {
    return accountList.filter(
      (i) =>
        promoteTokenList.indexOf(i.symbol) >= 0 &&
        i.name !== 'THE SUN' &&
        i.name !== 'Wrapped SOL',
    );
  }, [promoteTokenList]);

  const onRefresh = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  };

  return (
    <View style={grid.container}>
      <Header />
      <SafeAreaView style={grid.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              colors={[COLORS.white2]}
              tintColor={COLORS.white2}
            />
          }
        >
          <ExploreList balanceListInfo={sortedList} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Explore;
