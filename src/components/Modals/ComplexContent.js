import React, { useRef, useState, forwardRef } from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Modalize } from 'react-native-modalize';

import { useCombinedRefs } from '../../hooks/use-combined-refs';

const { width, height: initialHeight } = Dimensions.get('window');
const isAndroid = Platform.OS === 'android';

export const ComplexContent = forwardRef(({ Component }, ref) => {
  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);
  const [layoutHeight, setLayoutHeight] = useState(initialHeight);
  const [documentHeight, setDocumentHeight] = useState(initialHeight);
  const height = isAndroid ? documentHeight : layoutHeight;

  const handleLayout = ({ layout }) => {
    setLayoutHeight(layout.height);
  };

  return (
    <Modalize
      ref={combinedRef}
      scrollViewProps={{ showsVerticalScrollIndicator: false }}
      onLayout={handleLayout}
    >
      <Component height={height} />
    </Modalize>
  );
});

const s = StyleSheet.create({
  header: {
    height: 44,

    borderBottomColor: '#c1c4c7',
    borderBottomWidth: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },

  header__wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,

    paddingHorizontal: 12,

    height: '100%',
  },

  header__close: {
    marginRight: 25,
  },

  header__center: {
    flexDirection: 'row',
    alignItems: 'center',

    marginLeft: 'auto',
  },

  header__url: {
    marginLeft: 4,

    fontSize: 16,
    fontWeight: '500',
  },

  header__arrowRight: {
    marginLeft: 'auto',
    marginRight: 25,

    transform: [{ rotate: '180deg' }],
  },

  header__progress: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    backgroundColor: '#f6f7f9',

    opacity: 0,

    transform: [
      {
        translateX: -width,
      },
    ],
  },
});
