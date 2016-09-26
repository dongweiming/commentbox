import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import {Router, useRouterHistory} from 'react-router';
import { AppContainer } from 'react-hot-loader';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {createHashHistory} from 'history';
import AppRoutes from './AppRoutes';
import commentStore from './stores/commentStore';
import './vendor.css';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const hashHistory = useRouterHistory(createHashHistory)({queryKey: false});
const stores = { commentStore };

render(
  <AppContainer>
    <Provider { ...stores }>
      <Router
        history={hashHistory}
        onUpdate={() => window.scrollTo(0, 0)}
      >
        {AppRoutes}
      </Router>
    </Provider>
  </AppContainer>, document.getElementById('app'));

if (module.hot) {
  module.hot.accept('./AppRoutes', () => {
    const NextAppRoutes = require('./AppRoutes').default;

    render(
      <AppContainer>
        <Provider { ...stores }>
          <Router
            history={hashHistory}
            onUpdate={() => window.scrollTo(0, 0)}
          >
            {AppRoutes}
          </Router>
        </Provider>
      </AppContainer>,
      document.getElementById('app')
    );
  });
}
