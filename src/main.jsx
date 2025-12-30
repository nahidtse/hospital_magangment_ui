import ReactDOM from 'react-dom/client'
import { Routedata } from "./common/Routedata";
import App from "./layouts/App";
import './index.scss'
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Fragment } from 'react';
import Scrolltotop from './Scrolltotop';
import Login from './components/Authentication/Login';
import PrivateRoute from './components/Authentication/PrivateRoute';


ReactDOM.createRoot(document.getElementById('root')).render(
  <Fragment>
    <HelmetProvider>
      <BrowserRouter>
        <Scrolltotop />
        <Routes>

          <Route path={`${import.meta.env.BASE_URL}login`} element={ <Login />} />

          //main route


          {/* *************if Not Login, Not access This route/ Private Route**************  */}
          <Route
            path={`${import.meta.env.BASE_URL}`} 
            element={
              <PrivateRoute> 
                <App /> 
              </PrivateRoute>
            }
          >
          {Routedata.map((idx) => (
            <Route
              key={idx.id} 
              path={idx.path} 
              element={
              <PrivateRoute>
                {idx.element}
              </PrivateRoute>
            }  
            />
          ))}
          </Route>
          {/* *************if Not Login, Not access This route/ Private Route**************  */}

        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </Fragment>
);
