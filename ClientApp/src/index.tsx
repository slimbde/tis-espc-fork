//import 'babel-polyfill';
//import 'react-app-polyfill/ie9';
//import 'react-app-polyfill/ie11';
//import 'react-app-polyfill/stable';
import './index.scss';

import App from './App';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom"



const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')! as string;
const rootElement = document.getElementById('root');


ReactDOM.render(
  <HashRouter basename={baseUrl}>
    <App />
  </HashRouter>,
  rootElement
);
