import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { applyMiddleware, compose, createStore } from 'redux'
import { connect, Provider } from 'react-redux'
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

const Slider = props =>
  <div>
    <input
      type="range"
      name="freq"
      defaultValue={props.value}
      onChange={props.sliderAction}
    />
    {props.value}
  </div>

const mapStateToProps = state => ({
  sliders: state
})

const MappedSliders = props =>
  <div>
    {props.sliders.map((elem, index) => <Slider key={index} value={elem.num}/>)}
  </div>

const SliderCollection = connect(mapStateToProps)(MappedSliders)

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <SliderCollection/>
      </Provider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
