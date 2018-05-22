require('file-loader?name=[name].[ext]!../html/index.html');
require('../sass/style.scss');
import React from 'react';
import {render} from 'react-dom';
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import {BrowserRouter,Switch, Route, Link} from 'react-router-dom';
import promise from "redux-promise";

// Component Imports
import  Layout from './views/layout.js';
import  Scraper from './views/scraper.js';
import  Color from './views/color.js';

const app = document.querySelector('#yp-app');
render(
        <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Layout} />
                    <Route path="/scraper" component={Scraper} />
                    <Route path="/color" component={Color} />
                </Switch>
        </BrowserRouter>
        ,app);
