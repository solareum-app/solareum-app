import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';

const logger = createLogger({
  collapsed: true,

  // only log in development mode
  predicate: () => __DEV__,
});

export default function configureStore(staticReducers = {}) {
  const middlewares = [logger];
  const enhancers = [];

  enhancers.push(applyMiddleware(...middlewares));

  const initialState = {};
  const store = Object.assign(
    createStore(
      combineReducers({ ...staticReducers }),
      initialState,
      compose(...enhancers),
    ),
    {
      injectedReducers: staticReducers,
    },
  );

  return store;
}
