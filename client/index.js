import { applyMiddleware, compose, createStore } from 'redux'
import logger from 'redux-logger'

const INITIAL_VALUE = {
  num: 0
}

const INITIAL_STATE = [
  INITIAL_VALUE,
  INITIAL_VALUE,
  INITIAL_VALUE,
  INITIAL_VALUE
]

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "DOIT": {
      return state.map((item, index) => {
        if (index === action.index) {
          return {...item, num: action.payload}
        }
        return item
      })
      break;
    }
  }
  return state
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, /* preloadedState, */ composeEnhancers(
  applyMiddleware(logger)
));

store.dispatch({type: "DOIT", index: 0, payload: 1})
store.dispatch({type: "DOIT", index: 1, payload: 9})
store.dispatch({type: "DOIT", index: 3, payload: 91})
store.dispatch({type: "DOIT", index: 2, payload: 71})

store.subscribe(() => {
  // console.log(store.getState())
})
