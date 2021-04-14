import Redux, { combineReducers } from 'redux';
import { useStore } from 'react-redux';

type EnhancedStore = Redux.Store & {
  injectedReducers: { [index: string]: Redux.Reducer };
};

const useInjectReducer = (key: string, reducer: Redux.Reducer) => {
  const store = useStore() as EnhancedStore;

  if (Reflect.has(store.injectedReducers, key)) {
    // reducer key already exists, check if function is the same
    if (store.injectedReducers[key] === reducer) {
      // reducer function is the same, nothing to do
      return;
    }
    // reducer function is different, replace
    store.injectedReducers[key] = reducer;
    store.replaceReducer(combineReducers({ ...store.injectedReducers }));
  } else {
    // key doesn't exist yet, inject
    store.injectedReducers[key] = reducer;
    store.replaceReducer(combineReducers({ ...store.injectedReducers }));
  }
};

export default useInjectReducer;
