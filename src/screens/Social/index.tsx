import React, { useEffect, useState } from 'react';
import { SafeAreaView, RefreshControl, ScrollView, View } from 'react-native';

import LoadingIndicator from '../../components/LoadingIndicator';
import { COLORS } from '../../theme';
import { grid } from '../../components/Styles';
import { SocialItem } from './SocialItem';
import { Header } from './Header';

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const Social = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [eof, setEof] = useState(false);
  const [articleList, setArticleList] = useState([]);
  const [fetching, setFetching] = useState(false);

  const loadArticle = async (page = 0) => {
    setFetching(true);
    const oldList = page <= 0 ? [] : articleList;
    const data = await fetch(
      `https://wealthclub.vn/c/tin-tuc/9.json?page=${page}`,
    ).then((resp) => resp.json());
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
            {articleList.length
              ? articleList.map((i) => <SocialItem key={i.slug} model={i} />)
              : null}
            {fetching ? <LoadingIndicator /> : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Social;
