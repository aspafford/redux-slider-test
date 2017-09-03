import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { applyMiddleware, compose, createStore } from 'redux'
import { connect, Provider } from 'react-redux'
import thunk from 'redux-thunk'
import axios from 'axios'
import promise from 'redux-promise-middleware'
import logger from 'redux-logger'
import createDebounce from 'redux-debounced'

const INITIAL_STATE = []

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SLIDERS_FULFILLED": {
      return action.payload.data
    }
    case "DOIT":{
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
  applyMiddleware(createDebounce(), promise(), thunk, logger)
));

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

const sliderAction = (event, index) => {
  return {
    type: "DOIT",
    index: index,
    payload: parseInt(event.target.value)
  }
}

export const updateSlider = (index) => {
  return {
    type: "DOIT2",
    index: index,
    payload: "yar"
  }
}

const delayedEvent = (index) => {
  const thunk = (dispatch, getState) => {
    dispatch(updateSlider(index))
  }
  thunk.meta = {
    debounce: {
      time: 2000,
      key: 'UPDATE_SLIDER'
    }
  }
  return thunk
}

const mapStateToProps = state => ({
  sliders: state
})

const mapDispatchProperties =
  index =>
    dispatch => {
      return {
        sliderAction: event => {
          dispatch(sliderAction(event, index));
          dispatch(delayedEvent(index))
        }
      }
    }

const MappedSliders = props =>
  <div>
    {props.sliders.map((elem, index) =>
      <Slider key={index} value={elem.num}
        {...mapDispatchProperties(index)(props.dispatch)}/>
    )}
  </div>

const SliderCollection = connect(mapStateToProps)(MappedSliders)

class App extends Component {

  componentWillMount() {
    // promise dispatches FOO_PENDING, FOO_REJECTED, FOO_FULILLED
    store.dispatch({
      type: 'SLIDERS',
      payload: axios.get('http://rest.learncode.academy/api/jobill/sliders')
    })
  }

  render() {
    return (
      <Provider store={store}>
        <SliderCollection/>
      </Provider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
