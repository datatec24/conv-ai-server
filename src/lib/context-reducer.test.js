const { wrap } = require('co')
const contextReducer = require('./context-reducer')

describe('#MERGE', () => {
  it('should merge action data into context', wrap(function* () {
    const context = yield contextReducer({ foo: 'bar' }, {
      type: 'MERGE',
      data: {
        baz: 'qux'
      }
    })

    expect(context).toEqual({
      foo: 'bar',
      baz: 'qux'
    })
  }))
})

describe('#RESET', () => {
  it('should clear context', wrap(function* () {
    const context = yield contextReducer({ foo: 'bar' }, {
      type: 'RESET'
    })

    expect(context).toEqual({})
  }))
})

describe('#NOOP', () => {
  it('should return unmodified context', wrap(function* () {
    const context = yield contextReducer({ foo: 'bar' }, {
      type: 'NOOP'
    })

    expect(context).toEqual({ foo: 'bar' })
  }))
})

describe('no action', () => {
  it('should return unmodified context', wrap(function* () {
    const context = yield contextReducer({ foo: 'bar' })

    expect(context).toEqual({ foo: 'bar' })
  }))
})

describe('no action type', () => {
  it('should return unmodified context', wrap(function* () {
    const context = yield contextReducer({ foo: 'bar' }, {})

    expect(context).toEqual({ foo: 'bar' })
  }))
})

describe('unknown action type', () => {
  it('should return unmodified context', wrap(function* () {
    const context = yield contextReducer({ foo: 'bar' }, {
      type: 'NOT AN ACTION'
    })

    expect(context).toEqual({ foo: 'bar' })
  }))
})
