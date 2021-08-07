import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';
import LoadingIndicator from '../LoadingIndicator';

import { COLORS, FONT_SIZES } from '../../theme';
import Routes from '../../navigators/Routes';
import { useApp } from '../../core/AppProvider';
import { price } from '../../utils/autoRound';

const isValidUrl = (url: string) => {
  return url.indexOf('.png') >= 0 || url.indexOf('.svg') >= 0;
};

const iconStyle = StyleSheet.create({
  main: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
});

const getWidth = (svgString: string): number => {
  const startIndex = svgString.indexOf('width="') + 7;
  const endIndex = svgString.indexOf('"', startIndex);
  const w = svgString.substr(startIndex, endIndex - startIndex);
  return isNaN(parseInt(w)) ? 18 : parseInt(w);
};

const CryptoIcon = ({ uri, ...props }) => {
  const [width, setWidth] = useState(18);
  const [svgFile, setSvgFile] = useState('');
  const [loading, setLoading] = useState(true);
  const isSVG = uri.indexOf('.svg') >= 0;

  useEffect(() => {
    if (!isSVG) {
      return;
    }

    fetch(uri, { method: 'GET' })
      .then((res) => {
        return res.text();
      })
      .then((svg) => {
        const width = getWidth(svg);
        setWidth(width);
        setSvgFile(svg);
        setLoading(false);
      });
  }, []);

  if (isSVG) {
    return (
      <View style={iconStyle.main}>
        {loading ? (
          <LoadingIndicator />
        ) : (
          <SvgXml
            width="100%"
            height="100%"
            viewBox={`0 0 ${width} ${width}`}
            xml={svgFile}
          />
        )}
      </View>
    );
  }
  return <Avatar {...props} source={{ uri: uri }} />;
};

type TokenInfoItemProps = TokenInfo & {
  action?: string;
};
const TokenInfoItem: React.FC<TokenInfoItemProps> = ({ action, ...props }) => {
  const {
    name = 'Undefined',
    symbol = '---',
    logoURI = '',
    amount = 0,
    decimals,
    coingeckoId,
  } = props.token;
  const navigation = useNavigation();
  const { priceData } = useApp();
  const tokenPrice = priceData[coingeckoId] ? priceData[coingeckoId].usd : 0;
  const tokenEst = (tokenPrice * amount) / Math.pow(10, decimals);

  const onPressHandler = () => {
    navigation.navigate(Routes.Token, { token: props.token, action });
  };

  return (
    <ListItem
      bottomDivider
      onPress={onPressHandler}
      containerStyle={{
        backgroundColor: COLORS.dark0,
        borderBottomColor: COLORS.dark4,
      }}
    >
      {logoURI && isValidUrl(logoURI) ? (
        <CryptoIcon rounded uri={logoURI} />
      ) : (
        <Avatar rounded title={symbol.toUpperCase()} />
      )}
      <ListItem.Content>
        <ListItem.Title
          style={{ color: COLORS.white0, fontSize: FONT_SIZES.md }}
        >
          {name}
        </ListItem.Title>
        <ListItem.Subtitle
          style={{ color: COLORS.white4, fontSize: FONT_SIZES.sm }}
        >
          <Text>{`$${price(tokenPrice)}`}</Text>
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Content right style={{ flex: 1 }}>
        <ListItem.Title
          style={{
            color: COLORS.white0,
            fontSize: FONT_SIZES.md,
          }}
        >
          {`${price(amount / Math.pow(10, decimals))} ${symbol.toUpperCase()}`}
        </ListItem.Title>
        <ListItem.Subtitle
          style={{ color: COLORS.white4, fontSize: FONT_SIZES.sm }}
        >
          {`$${price(tokenEst)}`}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

type TokensListProps = {
  balanceListInfo: any[];
  action?: string;
};

const TokensList: React.FC<TokensListProps> = ({ balanceListInfo, action }) => {
  return (
    <>
      {balanceListInfo?.map((token, index: number) => (
        <TokenInfoItem key={index} token={token} action={action} />
      ))}
    </>
  );
};

export default TokensList;
