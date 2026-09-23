import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Home from './pages/home/page.jsx'
import Location from './pages/location/page.jsx'
import Gifts from './pages/gift/page.jsx'
import Photos from './pages/photo/page.jsx'
import Message from './pages/message/page.jsx'
import Cart from './pages/cart/page.jsx'
import Auth from './pages/auth/page.jsx'

const pages = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/location', element: <Location /> },
      { path: '/gifts', element: <Gifts /> },
      { path: '/photos', element: <Photos /> },
      { path: '/message', element: <Message /> },
      { path: '/cart', element: <Cart/>},
      { path: '/auth', element: <Auth /> }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={pages}></RouterProvider>
  </React.StrictMode>
)
