import React, { useEffect, useRef } from 'react';

/**
 * runs an effect only on dependency update, not on mount
 *
 * @param fn
 * @param inputs
 */
const useDidUpdateEffect = (
  fn: React.EffectCallback,
  inputs: React.DependencyList = [],
): void => {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      fn();
    } else {
      didMountRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, inputs);
};

export default useDidUpdateEffect;
