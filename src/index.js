import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainProvider from "./providers/mainProvider";
import './components/prototypes';

ReactDOM.render(
    <React.StrictMode>
        <MainProvider>
            <App/>
        </MainProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
