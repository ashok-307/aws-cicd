import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import NavBar from './components/NavBar';
import LoginComponent from './components/Login';
import { AuthService } from './services/AuthService';
import CreateSpace from './components/spaces/CreateSpace';
import { DataService } from './services/DataService';
import Spaces from './components/spaces/Spaces';

const authService = new AuthService();
const dataService = new DataService(authService);

function App() {
  const [username, setUserName] = useState<string | undefined>(undefined);

  const router = createBrowserRouter([
    {
      element: (
        <>
          <NavBar username={username} />
          <Outlet />
        </>
      ),
      children: [
        {
          path: '/',
          element: <div>Hello World!</div>
        },
        {
          path: '/login',
          element: <LoginComponent authService={authService} setUserNameCb={setUserName}/>
        },
        {
          path: '/profile',
          element: <div>Profile Page</div>
        },
        {
          path: '/createSpace',
          element: <CreateSpace dataService={dataService}/>
        },
        {
          path: '/spaces',
          element: <Spaces dataService={dataService}/>
        },
      ]
    }
  ]);

  return (
    <div>
      <h1>App Works!</h1>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
