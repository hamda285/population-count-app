import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { Home } from "./pages/Home";
import { States } from "./pages/States";
import { Districts } from "./pages/Districts";
import { Dashboard } from "./pages/Dashboard";
import { RegisterPerson } from "./pages/RegisterPerson";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { NotFound } from "./pages/Notfound";
import { ManageUsers } from "./pages/ManageUsers";
import { EditProfile } from "./components/EditProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },

      // Public Routes
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },

      // Protected Routes
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      
      {
        path: "register",
        element: (
          <ProtectedRoute>
            <RegisterPerson />
          </ProtectedRoute>
        ),
      },
      {
        path: "states",
        element: (
          <ProtectedRoute>
            <States />
          </ProtectedRoute>
        ),
      },
      {
        path: "districts",
        element: (
          <ProtectedRoute>
            <Districts />
          </ProtectedRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <ProtectedRoute adminOnly>
            <ManageUsers />
          </ProtectedRoute>
        ),
      },

      {
        path: "edit-profile",
        element: (
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
