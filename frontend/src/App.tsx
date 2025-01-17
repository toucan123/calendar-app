import './App.css'
import Login from './components/Login';
import Home from './components/Home';
import { AuthProvider, useAuth } from './authentication/RequireAuth';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import React from 'react';

const ProtectedRoute: React.FC<{ children: React.ReactNode}> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to='/login'/>
  }
  return children
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><Home /></ProtectedRoute>,
  },
  {
    path: '/login',
    element: <Login/>,
  },
]);


const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  );
}

export default App