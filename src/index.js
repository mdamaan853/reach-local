import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'semantic-ui-css/semantic.min.css';
window.rla = {};
// window.rla.mobile = navigator.userAgent;
window.rla.mobile = navigator.userAgent.includes('Mobile');

ReactDOM.render(<App/>, document.getElementById('root'));
serviceWorker.register();
