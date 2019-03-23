import { get, set } from 'carbo'

// Handler
type Handler = () => void
type Unsubscriber = () => void

// State
type State = Object

// Broker
type Atom = {
  handlers: Set<Handler>
  ref: { state: State }
  path: Array<string>
}

// Create an atom
export const create = (state: State = {}): Atom => ({
  handlers: new Set(),
  ref: { state },
  path: []
})

// Create a cursor from the atom
export const cursor = (atom: Atom, path: Array<string>): Atom => ({
  ...atom,
  path: [...atom.path, ...path]
})

// Deref the atom
export const deref = (atom: Atom): State =>
  atom.path.length ? get(atom.ref.state, atom.path) : atom.ref.state

// Publish
export const reset = (atom: Atom, state: State): void => {
  // Load the data
  const { handlers, ref, path } = atom

  // We didn't change anything
  if (deref(atom) === state) {
    return
  }

  // Update state
  ref.state = path.length ? set(ref.state, path, state) : state

  // Notify
  handlers.forEach((handler: Handler) => {
    handler()
  })
}

// Subscribe
export const watch = (atom: Atom, watcher: Handler): Unsubscriber => {
  // Load data from the broker
  const { handlers, ref, path } = atom

  // Get the state
  let prevState: State = deref(atom)

  // Wrapper for the handler
  const handler: Handler = (): void => {
    // Load the current state
    const nextState = deref(atom)

    // Test if the event matches
    if (nextState === prevState) {
      return
    }

    // Call the handler
    watcher()

    // Save the state for next time
    prevState = nextState
  }

  // Attach the handler
  handlers.add(handler)

  // Return an unsubscriber
  return () => {
    handlers.delete(handler)
  }
}
