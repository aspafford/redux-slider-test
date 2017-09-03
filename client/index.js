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

const API_URL = 'http://rest.learncode.academy/api/user1ab75/collection'

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SAVING_SLIDER": {
      break
    }
    case "SLIDERS_FULFILLED": {
      return action.payload.data
    }
    case "UPDATE_SLIDER":{
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
      defaultValue={props.value}
      onChange={props.sliderAction}
    />
    {props.value}
  </div>

const sliderAction = (event, index) => {
  return {
    type: "UPDATE_SLIDER",
    index: index,
    payload: parseInt(event.target.value)
  }
}

export const saveSlider = () => {
  return {
    type: "SAVING_SLIDER",
  }
}

const asyncSaveSlider = (index) => {
  const thunk = (dispatch, getState) => {
    dispatch(saveSlider())
    let s = getState()
    let entity = s[index]
    // axios put update
    axios({
      method:'put',
      url: API_URL + '/' + entity.id,
      data: entity
    })
  }

  thunk.meta = {
    debounce: {
      time: 1000,
      key: 'SAVE_SLIDER'
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
          dispatch(asyncSaveSlider(index))
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
      payload: axios.get(API_URL)
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
