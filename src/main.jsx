import React from 'react';
import ReactDOM from 'react-dom/client';
import { router } from "./routes.jsx";
import { AuthProvider } from './context/AuthContext.jsx';
import { RouterProvider } from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
