import { useAuth } from '../authentication/RequireAuth';

const LogOutButton = () => {
  const { logout } = useAuth();

  return <button onClick={logout}>Sign out</button>;
};

export default LogOutButton;