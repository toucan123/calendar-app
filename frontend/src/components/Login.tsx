import { useAuth } from '../authentication/RequireAuth';

const Login = () => {
  const { login } = useAuth();
  
  return <button onClick={login}>Sign in with Google</button>;
};

export default Login;