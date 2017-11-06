const {combineReducers} = require('redux');
const _ = require('lodash');

module.exports = (rootReducer, childReducers = []) => {
  if (_.isUndefined(rootReducer) || _.isNull(rootReducer)) {
    throw new Error('root reducer is expected');
  }

  if (!_.isFunction(rootReducer)) {
    throw new Error('root reducer is not a function');
  }

  if (_.isEmpty(childReducers)) {
    return rootReducer;
  }

  const combinedReducer = combineReducers(childReducers);

  return (state, action) => {
    return _.merge(rootReducer(state, action), combinedReducer(state, action));
  };
};