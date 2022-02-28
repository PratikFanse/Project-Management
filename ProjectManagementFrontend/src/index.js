import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Component/App/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import axios from "axios";
import cookie from 'js-cookie';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "https://665b8276397e4380943d9fc7a58b5db4@o1146959.ingest.sentry.io/6216631",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  release: "ProjectManagement@v0.0.1",
});

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
