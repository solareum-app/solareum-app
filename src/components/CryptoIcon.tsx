import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';
import { SvgXml } from 'react-native-svg';

import LoadingIndicator from './LoadingIndicator';

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

export const CryptoIcon = ({ uri = '', ...props }) => {
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

  if (!uri) {
    return <Avatar rounded />;
  }

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
