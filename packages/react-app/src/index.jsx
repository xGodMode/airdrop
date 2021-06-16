import React from "react"
import { ThemeSwitcherProvider } from 'react-css-theme-switcher'
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'

import App from "./App"
import rootReducer from "./reducers/root"

import "./index.css"

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

let store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`,
}

ReactDOM.render(
  <Provider store={store}>
    <ThemeSwitcherProvider defaultTheme="light" themeMap={themes} insertionPoint={document.getElementById('inject-styles-here')}>
      <App subgraphUri="REMOVE_THIS_PROP" />
    </ThemeSwitcherProvider>
  </Provider>,
  document.getElementById("root"),
)
