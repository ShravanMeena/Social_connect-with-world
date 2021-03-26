import React, { Component } from "react";

import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Landing from "./pages/Landing";
import Activation from "./pages/Activation";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";

// redux ofline or redux persist
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";
import Header from "./component/Header";
import Footer from "./component/Footer";

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <Route render={({ history }) => <Header history={history} />} />
            <Switch>
              <Route exact path='/' component={Landing} />
              <Route
                exact
                strict
                path='/user/activate/:token'
                component={Activation}
              />

              <Route exact strict path='/home' component={Home} />
              <Route exact strict path='/user/:id' component={Profile} />
              <Route exact strict path='/find-friends' component={Friends} />
            </Switch>
            <Footer />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    );
  }
}
