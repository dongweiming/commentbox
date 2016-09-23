import React from 'react';
import {Route, Redirect, IndexRoute} from 'react-router';

import Master from './components/Master';
import Home from './components/Home';

const AppRoutes = (
        <Route path="/" component={Master}>
          <IndexRoute component={Home} />
          <Route path="home" component={Home} />
        </Route>
);

export default AppRoutes;
