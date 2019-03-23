import { create, cursor, deref, reset, watch } from '../src/atome'

// Create an atom
const state = {
  context: {
    visible: true,
    data: {
      '01234567-abcd-4abc-8def-0123456789ab': {
        id: '01234567-abcd-4abc-8def-0123456789ab',
        name: 'Hello'
      }
    }
  }
}

// Convert
describe('Atom', () => {
  test('When initialized without parameters internal state should default to an empty object', () => {
    // Create a new atom
    const atom = create()

    // Test
    expect(deref(atom)).toEqual({})
  })

  test('When initialized with parameters, the state passed in state be the initial state', () => {
    // Create a new atom
    const atom = create(state)

    // Check the state to match
    expect(deref(atom)).toBe(state)
  })

  test('When the atom is resetted with a value the internal state should be the value', () => {
    // Create a new atom
    const atom = create(state)

    // Load the new data
    const data = {
      reset: true
    }

    // Reset the state
    reset(atom, data)

    // Check the state to match
    expect(deref(atom)).toEqual(data)
  })

  test('When resetting the atom, the registered handlers will trigger', () => {
    // Create a new atom
    const atom = create(state)

    // Create a handler
    const handler = jest.fn()

    // Set the h
    watch(atom, handler)

    // Load the new data
    const data = {
      reset: true
    }

    // Reset the state
    reset(atom, data)

    // Expect the function to be called once
    expect(handler).toBeCalled()
  })

  test('When resetting the atom to the same state, the registered handlers will not trigger', () => {
    // Create a new atom
    const atom = create(state)

    // Create a handler
    const handler = jest.fn()

    // Set the h
    watch(atom, handler)

    // Reset the state
    reset(atom, state)

    // Expect the function not to be called
    expect(handler).not.toBeCalled()
  })

  test('When unsubscribed, state change will not trigger further calls', () => {
    // Create a new atom
    const atom = create(state)

    // Create a handler
    const handler = jest.fn()

    // Set the h
    const unwatch = watch(atom, handler)

    // Unsubscribe
    unwatch()

    // Load the new data
    const data = {
      reset: true
    }

    // Reset the state
    reset(atom, data)

    // Expect the function to be called only once
    expect(handler).not.toBeCalled()
  })

  test('When initialized with an empty path, the cursor state should be the same as the atom state', () => {
    // Create a new cursor
    const atom = create(state)
    const pointer = cursor(atom, [])

    // Check the state to match
    expect(deref(pointer)).toBe(state)
  })

  test('When initialized with an path, the state should be the initialized atom substate at that path', () => {
    // Create a new cursor
    const atom = create(state)
    const pointer = cursor(atom, ['context'])

    // Check the state to match
    expect(deref(pointer)).toBe(state.context)
  })

  test('When the cursor is resetted, the passed data should be matching the internal state', () => {
    // Create a new cursor
    const atom = create(state)
    const pointer = cursor(atom, ['context'])

    // Load the new data
    const data = {
      reset: true
    }

    // Reset the state
    reset(pointer, data)

    // Check the state to match
    expect(deref(pointer)).toBe(data)
  })

  test('When resetting the cursor, the registered handlers will trigger', () => {
    // Create a new cursor
    const atom = create(state)
    const pointer = cursor(atom, ['context'])

    // Create a handler
    const handler = jest.fn()

    // Set the h
    watch(pointer, handler)

    // Load the new data
    const data = {
      reset: true
    }

    // Reset the state
    reset(pointer, data)

    // Expect the function to be called
    expect(handler).toBeCalled()
  })

  test('When resetting the cursor with the same state, the registered handlers will not trigger', () => {
    // Create a new cursor
    const atom = create(state)
    const pointer = cursor(atom, ['context'])

    // Create a handler
    const handler = jest.fn()

    // Set the h
    watch(pointer, handler)

    // Reset the state
    reset(pointer, state.context)

    // Expect the function to be called only once
    expect(handler).not.toBeCalled()
  })

  test('When unsubscribing from a cursor will prevent any further calls on the unsubscribed handler', () => {
    // Create a new cursor
    const atom = create(state)
    const pointer = cursor(atom, ['context'])

    // Create a handler
    const handler = jest.fn()

    // Set the h
    const unwatch = watch(pointer, handler)

    // Unsubscribe
    unwatch()

    // Load the new data
    const data = {
      reset: true
    }

    // Reset the state
    reset(pointer, data)

    // Expect the function to be called only once
    expect(handler).not.toBeCalled()
  })

  test('When resetting the data in the atom, the cursor handlers are not triggered if their state is the same', () => {
    // Create a new cursor
    const atom = create(state)
    const pointer = cursor(atom, ['context'])

    // Create a handler
    const ch = jest.fn()
    const ah = jest.fn()

    // Set the h
    watch(pointer, ch)
    watch(atom, ah)

    // Reset the state
    reset(atom, { context: state.context })

    // Expect the function to be called only once
    expect(ch).not.toBeCalled()
    expect(ah).toBeCalled()
  })

  test('When resetting the state in the cursor, the parents active handlers are notified', () => {
    // Create a new cursor
    const atom = create(state)
    const pointer = cursor(atom, ['context', 'data'])
    const subpointer = cursor(pointer, ['01234567-abcd-4abc-8def-0123456789ab'])

    // Create a handler
    const ch = jest.fn()
    const ah = jest.fn()

    // Set the h
    watch(pointer, ch)
    watch(atom, ah)

    // Reset the state
    reset(subpointer, {})

    // Expect the function to be called only once
    expect(ch).toBeCalled()
    expect(ah).toBeCalled()
  })

  test('When resetting the state in the parent, the children active handlers are notified', () => {
    // Create a new cursor
    const atom = create(state)
    const pointer = cursor(atom, ['context', 'data'])
    const subpointer = cursor(pointer, ['01234567-abcd-4abc-8def-0123456789ab'])

    // Create a handler
    const ch = jest.fn()
    const sh = jest.fn()

    // Set the h
    watch(pointer, ch)
    watch(subpointer, sh)

    // Reset the state
    reset(atom, {
      reset: true
    })

    // Expect the function to be called only once
    expect(ch).toBeCalled()
    expect(sh).toBeCalled()
  })
})
