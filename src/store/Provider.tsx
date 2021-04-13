import React from 'react';
import { Provider } from 'react-redux';

import configureStore from './configureStore';

type Props = {};

const StoreProvider = ({ children }: React.PropsWithChildren<Props>) => {
  const store = React.useMemo(() => configureStore(), []);

  return <Provider store={store}>{children}</Provider>
};

export default StoreProvider;
