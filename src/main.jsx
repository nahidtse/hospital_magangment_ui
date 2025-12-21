import ReactDOM from 'react-dom/client'
import { Routedata } from "./common/Routedata";
import App from "./layouts/App";
import './index.scss'
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Fragment } from 'react';
import Scrolltotop from './Scrolltotop';


ReactDOM.createRoot(document.getElementById('root')).render(
  <Fragment>
    <HelmetProvider>
      <BrowserRouter>
        <Scrolltotop />
        <Routes>

          //main route

          <Route path={`${import.meta.env.BASE_URL}`} element={<App />}>
            {Routedata.map((idx) => (
              <Route key={idx.id} path={idx.path} element={idx.element} />
            ))}
          </Route>

        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </Fragment>
);
