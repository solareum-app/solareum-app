import { CryptoIcon } from '@Components/CryptoIcon';
import { LoadingImage } from '@Components/LoadingIndicator';
import { grid, typo } from '@Components/Styles';
import { MissionButton } from '@Containers/MissionButton';
import { usePrice } from '@Core/AppProvider/PriceProvider';
import Routes from '@Navigators/Routes';
import { useNavigation } from '@react-navigation/native';
import { SocialItem } from '@Screens/Social/SocialItem';
import { COLORS } from '@Theme/colors';
import { authFetch } from '@Utils/authfetch';
import { price } from '@Utils/autoRound';
import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Button } from 'react-native-elements';

const s = StyleSheet.create({
  header: {
    ...grid.header,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  info: {
    flex: 1,
    alignItems: 'center',
    marginTop: 36,
    marginBottom: 24,
  },
  infoBalance: {
    fontSize: 28,
    color: COLORS.white0,
  },
  control: {
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
  },
  controlItem: {
    marginLeft: 12,
    marginRight: 12,
  },
  est: {
    ...typo.normal,
    marginBottom: 0,
    lineHeight: 20,
  },
  name: {
    ...typo.helper,
    marginTop: 12,
    marginBottom: 0,
  },
});

export const ExploreItem = ({ route }: any) => {
  const { token } = route.params;

  const { accountList } = usePrice();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [account, setAccount] = useState(token);
  const [articleList, setArticleList] = useState<any>([]);
  const navigation = useNavigation();

  const {
    symbol = '$$$',
    logoURI = '',
    amount = 0,
    decimals,
    name,
    usd,
  } = account;
  const est = (amount / Math.pow(10, decimals)) * usd;

  const gotoToken = () => {
    navigation.navigate(Routes.Token, { token });
  };

  const onRefresh = async () => {
    setLoading(true);
    await loadArticle();
    setLoading(false);
  };

  const loadArticle = async () => {
    setFetching(true);
    try {
      const data = await authFetch(
        `https://wealthclub.vn/tag/${symbol}.json?page=0`,
      );
      setArticleList(data.topic_list.topics);
    } catch {
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    const acc = accountList.find((i) => i.publicKey === account.publicKey);
    if (account.publicKey && acc) {
      setAccount(acc);
    }
  }, [account.publicKey, accountList]);

  useEffect(() => {
    loadArticle();
  }, []);

  return (
    <View style={grid.container}>
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
        <View style={s.header}>
          <View style={s.info}>
            <CryptoIcon uri={logoURI} size={56} />
            <Text style={s.name}>{name}</Text>
            <Text style={s.infoBalance}>
              {`${price(
                amount / Math.pow(10, decimals),
                decimals,
              )} ${symbol.toUpperCase()}`}
            </Text>
            <Text style={s.est}>≈${price(est)}</Text>
          </View>
          <Button title={`Buy ${symbol}`} onPress={gotoToken} />
        </View>

        <View style={{ ...grid.content, marginBottom: 36 }}>
          {fetching ? <LoadingImage /> : null}

          {articleList.length
            ? articleList.map((i) => <SocialItem key={i.slug} model={i} />)
            : null}

          {!fetching ? (
            <View>
              <MissionButton padding={0} />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};
