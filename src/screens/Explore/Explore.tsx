import { grid } from '@Components/Styles';
import { usePrice } from '@Core/AppProvider/PriceProvider';
import { useConfig } from '@Core/AppProvider/RemoteConfigProvider';
import { ExploreList } from '@Screens/Explore/List';
import { COLORS } from '@Theme/colors';
import React, { useMemo, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView } from 'react-native';

export const Explore: React.FC = () => {
  const { accountList } = usePrice();
  const { promoteTokenList } = useConfig();
  const [loading, setLoading] = useState<boolean>(false);

  const sortedList = useMemo(() => {
    return accountList.filter(
      (i) =>
        promoteTokenList.indexOf(i.symbol) >= 0 &&
        i.name !== 'THE SUN' &&
        i.name !== 'Wrapped SOL',
    );
  }, [accountList, promoteTokenList]);

  const onRefresh = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  };

  return (
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
  );
};

export default Explore;
