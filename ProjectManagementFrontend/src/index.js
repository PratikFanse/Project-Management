import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Component/App/App';
import reportWebVitals from './reportWebVitals';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import axios from "axios";
import cookie from 'js-cookie';

axios.interceptors.request.use(function(request){
    const token = cookie.get('access_token');
    request.url = `${process.env.REACT_APP_BACKEND_BASE_URL}${request.url}`
    request.headers.Authorization = token ? `Bearer ${token}`:'';
    return request
})

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <Routes> */}
        <App/>
        {/* <Route path="/" exact element={<App/>} /> */}
        {/* <Route path="/login" exact element={<Login/>}/> */}
      {/* </Routes> */}
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
