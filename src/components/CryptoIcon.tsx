import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { getIcon, setIcon } from '../storage/SvgIconCollection';
import { COLORS } from '../theme';
import LoadingIndicator from './LoadingIndicator';
import { ImageCached } from './ImageCached/ImageCached';
import { authFetch } from '../utils/authfetch';

const iconStyle = StyleSheet.create({
  main: {
    width: 36,
    height: 36,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: COLORS.dark4,
  },
});

const getWidth = (svgString: string): number => {
  const startIndex = svgString.indexOf('width="') + 7;
  const endIndex = svgString.indexOf('"', startIndex);
  const w = svgString.substr(startIndex, endIndex - startIndex);
  return isNaN(parseInt(w, 10)) ? 18 : parseInt(w, 10);
};

export const CryptoIcon = ({ uri = '', size = 40, ...props }) => {
  const [width, setWidth] = useState(18);
  const [svgFile, setSvgFile] = useState('');
  const [loading, setLoading] = useState(true);
  const isSVG = uri.indexOf('.svg') >= 0;

  const fetchIcon = async (uri) => {
    return await authFetch(uri, { method: 'GET' });
  };

  useEffect(() => {
    if (!isSVG) {
      return;
    }

    (async () => {
      let svg = await getIcon(uri);
      if (svg) {
        setWidth(getWidth(svg));
        setSvgFile(svg);
        setLoading(false);
      }

      svg = await fetchIcon(uri);
      setWidth(getWidth(svg));
      setSvgFile(svg);
      setLoading(false);
      setIcon(uri, svg);
    })();
  }, []);

  if (!uri) {
    return <View style={[iconStyle.main, { width: size, height: size }]} />;
  }

  if (isSVG) {
    return (
      <View style={[iconStyle.main, { width: size, height: size }]}>
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

  return (
    <View style={[iconStyle.main, { width: size, height: size }]}>
      <ImageCached
        {...props}
        source={{ uri: uri }}
        style={{ width: size, height: size }}
      />
    </View>
  );
};
