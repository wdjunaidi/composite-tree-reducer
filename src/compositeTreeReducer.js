const {combineReducers} = require('redux');
const _ = require('lodash');

module.exports = (rootReducer, childReducers = {}) => {
  if (_.isNil(rootReducer)) {
    throw new Error('root reducer is expected');
  }

  if (!_.isFunction(rootReducer)) {
    throw new Error('root reducer is not a function');
  }

  if (_.isEmpty(childReducers)) {
    return rootReducer;
  }

  const combinedReducer = combineReducers(childReducers);
  const childrenKeys = _.keys(childReducers);

  return (state, action) => {
    const childrenState = _.pick(state, childrenKeys);
    return Object.assign({}, rootReducer(state, action), combinedReducer(childrenState, action));
  };
};