const compositeTreeReducer = require('../src/compositeTreeReducer');

test('throw error when no rootReducer is provided', () => {
    expect(compositeTreeReducer).toThrow('root reducer is expected');
    expect(() => compositeTreeReducer(null)).toThrow('root reducer is expected');
});

test('throw error when root reducer is not a function', () => {
    expect(() => compositeTreeReducer({})).toThrow('root reducer is not a function');
    expect(() => compositeTreeReducer(3)).toThrow('root reducer is not a function');
    expect(() => compositeTreeReducer('test')).toThrow('root reducer is not a function');
    expect(() => compositeTreeReducer(Symbol('foo'))).toThrow('root reducer is not a function');
});

test('returns root reducer when no child reducers are provided', () => {
    const rootReducer = state => state;

    expect(compositeTreeReducer(rootReducer)).toBe(rootReducer);
});