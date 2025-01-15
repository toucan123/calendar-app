import './App.css'
import Login from './components/Login';
import Home from './components/Home';
import { RequireAuth } from './authentication/RequireAuth';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RequireAuth><Home /></RequireAuth>,
  },
  {
    path: '/login',
    element: <Login/>
  },
]);


const App = () => {
  return (
    <RouterProvider router={router}/>
  );
}

export default App