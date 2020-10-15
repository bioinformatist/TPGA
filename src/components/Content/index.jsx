import React from 'react';
import {
  HashRouter, Route, Switch, Redirect,
} from 'react-router-dom';
import Expression from '../../pages/expression';
import Home from '../../pages/home';
import Gwas from '../../pages/gwas';
import Cpg from '../../pages/cpg';
import Contact from '../../pages/contact';
import Search from '../../pages/search';

export default () => (
  <HashRouter>
    <Switch>
      <Route path="/expression" component={Expression} />
      <Route path="/search" component={Search} />
      <Route path="/home" component={Home} />
      <Route path="/gwas" component={Gwas} />
      <Route path="/cpg" component={Cpg} />
      <Route path="/contact" component={Contact} />
      <Route exact path="/" component={Home} />
      <Redirect to="/home" />
    </Switch>
  </HashRouter>
);
