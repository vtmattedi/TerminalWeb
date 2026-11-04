import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Game from './game';
import Rtsim from './rtsim';
import Home from './home';
import NotFound from './Components/AppShell/NotFound';

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "console-adventure",
        element: <Game />,
      },
      {
        path: "game",
        element: <Navigate to="/console-adventure" replace />,
      },
      {
        path: "rtsim",
        element: <Rtsim />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
])


root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
