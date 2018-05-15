require('file-loader?name=[name].[ext]!../html/index.html');
require('../sass/style.scss');
import React from 'react';
import {render} from 'react-dom';
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import {BrowserRouter,Switch, Route, Link} from 'react-router-dom';
import promise from "redux-promise";

import  Layout from './views/layout.js';
import  Scraper from './views/scraper.js';

const app = document.querySelector('#yp-app');
render(
        <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Layout} />
                    <Route path="/scraper" component={Scraper} />
                </Switch>
        </BrowserRouter>
        ,app);
