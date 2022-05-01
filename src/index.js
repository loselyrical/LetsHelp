import React from 'react';
import './index.css';
import App from './App';
import {Provider} from "react-redux";
import {makeStore} from "./redux/store";
import Providers from "./components/Providers";
import {BrowserRouter} from "react-router-dom";
import ReactDOM from 'react-dom';

ReactDOM.render(
    <BrowserRouter>
        <Providers>
            <Provider store={makeStore}>
                <App/>
            </Provider>
        </Providers>
    </BrowserRouter>,
    document.getElementById('root')
);
