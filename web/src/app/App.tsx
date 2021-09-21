import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import Main from "./main/Main"
import Login from "./login/Login"
import Register from "./register/Register"

export default function App() {
  return (
    <Router>
      <Redirect exact from="/" to="login" />
      <Switch>
          <Route path="/main">
            <Main />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
        </Switch>
    </Router>
  );
}
