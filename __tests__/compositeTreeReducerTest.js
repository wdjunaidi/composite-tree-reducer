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
    const rootReducer = state => Object.assign({}, state, {a: state.a + 1});
    const reducer = compositeTreeReducer(rootReducer);
    expect(reducer).toBe(rootReducer);
    expect(reducer({a: 1})).toMatchObject({a: 2});
});

test('simple compositeTreeReducer', () => {
    const rootReducer = (state = {}, action) => {
        switch (action.type) {
            case 'TEST': return Object.assign({}, state, {a: state.a + 1});
            default: return state;
        }
    }
    const child = (state = {}, action) => {
        switch (action.type) {
            case 'TEST': return Object.assign({}, state, {foo: state.foo * 2});
            default: return state;
        }
    };
    const childReducers = {
        child
    };

    const reducer = compositeTreeReducer(rootReducer, childReducers);
    expect(reducer({a: 1, child: {foo: 1}}, {type: 'TEST'})).toMatchObject({a: 2, child: {foo: 2}});
    expect(reducer({a: 4, child: {foo: 5}}, {type: 'TEST'})).toMatchObject({a: 5, child: {foo: 10}});
});

test('more complex compositeTreeReducer', () => {
    const rootReducer = (state = {}, action) => {
        switch (action.type) {
            case 'TEST': return Object.assign({}, state, {a: state.a + 1});
            default: return state;
        }
    };
    const child1 = (state = {}, action) => {
        switch (action.type) {
            case 'TEST': return Object.assign({}, state, {foo: state.foo * 2});
            default: return state;
        }
    };
    const child2 = (state = {}, action) => {
        switch (action.type) {
            case 'TEST': return Object.assign({}, state, {b: state.b + 'oy'});
            default: return state;
        }
    };
    const childReducers = {
        child1,
        child2
    };

    const reducer = compositeTreeReducer(rootReducer, childReducers);
    expect(reducer({
        a: 1, 
        child1: {foo: 1}, 
        child2: {b: 'ah'}
    }, {type: 'TEST'})).toMatchObject({
        a: 2, 
        child1: {foo: 2},
        child2: {b: 'ahoy'}
    });
    expect(reducer({
        a: 4, 
        child1: {foo: 5},
        child2: {b: 'oy'}
    }, {type: 'TEST'})).toMatchObject({
        a: 5, 
        child1: {foo: 10},
        child2: {b: 'oyoy'}
    });
});

test('more complex nested compositeTreeReducer', () => {
    const rootReducer = (state = {}, action) => {
        switch (action.type) {
            case 'TEST': return Object.assign({}, state, {a: state.a + 1});
            default: return state;
        }
    };
    const child1 = (state = {}, action) => {
        switch (action.type) {
            case 'TEST': return Object.assign({}, state, {foo: state.foo * 2});
            default: return state;
        }
    };
    const rootchild2 = (state = {}, action) => {
        switch (action.type) {
            case 'TEST': return Object.assign({}, state, {b: state.b + 'oy'});
            default: return state;
        }
    };
    const grandchild1 = (state = {}, action) => {
        switch (action.type) {
            case 'TEST': return Object.assign({}, state, {bar: state.bar - 5});
            default: return state;
        }
    };
    const grandchild2 = (state = {}, action) => {
        switch (action.type) {
            case 'TEST': return Object.assign({}, state, {z: state.z + 'ish'});
            default: return state;
        }
    };

    const reducer = compositeTreeReducer(rootReducer, {
        child1,
        child2: compositeTreeReducer(rootchild2, {
            grandchild1,
            grandchild2
        })
    });
    expect(reducer({
        a: 1, 
        child1: {foo: 1}, 
        child2: {
            b: 'ah',
            grandchild1: {bar: 3},
            grandchild2: {z: 'null'}
        }
    }, {type: 'TEST'})).toMatchObject({
        a: 2, 
        child1: {foo: 2},
        child2: {
            b: 'ahoy',
            grandchild1: {bar: -2},
            grandchild2: {z: 'nullish'}
        }
    });
});