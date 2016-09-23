import React from 'react';
import {Route, Redirect, IndexRoute} from 'react-router';

import Master from './components/Master';
import Home from './components/Home';
import Star from './components/Star';

const AppRoutes = (
        <Route path="/" component={Master}>
          <IndexRoute component={Home} />
          <Route path="home" component={Home} />
          <Route path="star" component={Star} />
        </Route>
);

export default AppRoutes;
