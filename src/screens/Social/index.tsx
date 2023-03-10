import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  RefreshControl,
  ScrollView,
  View,
  FlatList,
  StyleSheet,
} from 'react-native';

import { LoadingImage } from '../../components/LoadingIndicator';
import { COLORS } from '../../theme';
import { grid } from '../../components/Styles';
import { SocialItem } from './SocialItem';
import { Header } from './Header';
import { authFetch } from '../../utils/authfetch';
import { usePrice } from '../../core/AppProvider/PriceProvider';
import { useConfig } from '../../core/AppProvider/RemoteConfigProvider';
import { PromoteItem } from './PromoteItem';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../navigators/Routes';

const s = StyleSheet.create({
  tokenMain: {
    marginBottom: 24,
  },
});

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const Social = () => {
  const { accountList } = usePrice();
  const { promoteTokenList } = useConfig();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [eof, setEof] = useState(false);
  const [articleList, setArticleList] = useState([]);
  const [fetching, setFetching] = useState(false);

  const promoteTokens = useMemo(() => {
    return accountList
      .filter(
        (i) =>
          promoteTokenList.indexOf(i.symbol) >= 0 &&
          i.name !== 'THE SUN' &&
          i.name !== 'Wrapped SOL',
      )
      .slice(0, 6);
  }, [promoteTokenList]);

  const loadArticle = async (page = 0) => {
    setFetching(true);
    const oldList = page <= 0 ? [] : articleList;
    const data = await authFetch(
      `https://wealthclub.vn/c/news/15.json?page=${page}`,
    );
    setEof(data.topic_list.more_topics_url ? false : true);
    setArticleList(oldList.concat(data.topic_list.topics));
    setPage(page);
    setFetching(false);
  };

  const init = async () => {
    await loadArticle(0);
  };

  const onRefresh = async () => {
    setLoading(true);
    await init();
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <SafeAreaView style={grid.container}>
        <ScrollView
          onMomentumScrollEnd={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent) && !fetching && !eof) {
              loadArticle(page + 1);
            }
          }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              colors={[COLORS.white2]}
              tintColor={COLORS.white2}
            />
          }
        >
          <View style={grid.content}>
            {fetching ? <LoadingImage /> : null}

            <View style={s.tokenMain}>
              <FlatList
                data={promoteTokens}
                numColumns={3}
                renderItem={({ item }) => <PromoteItem token={item} />}
              />
              <Button
                title="more tokens"
                type="outline"
                onPress={() => {
                  navigation.navigate(Routes.ExploreList, {});
                }}
              />
            </View>

            {articleList.map((i) => (
              <SocialItem key={i.slug} model={i} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Social;
