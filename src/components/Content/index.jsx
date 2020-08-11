import React from 'react';
import {
  HashRouter, Route, Switch, Redirect,
} from 'react-router-dom';
import Explorer from '../../pages/explorer';
import Home from '../../pages/home';

export default () => (
  <HashRouter>
    <Switch>
      <Route path="/explorer" component={Explorer} />
      <Route path="/home" component={Home} />
      <Route exact path="/" component={Home} />
      <Redirect to="/home" />
    </Switch>
  </HashRouter>
);
