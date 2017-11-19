import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { BrowserRouter } from 'react-router-dom'
import WebFont from 'webfontloader';


ReactDOM.render(
  <BrowserRouter>
    <div>
      <App/>
    </div>
  </BrowserRouter>,
  document.getElementById('root')
);

registerServiceWorker();

WebFont.load({
  google: {
    families: ['Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i', 'sans-serif']
  }
});



