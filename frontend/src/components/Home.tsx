import { useAuth } from '../authentication/RequireAuth';
import LogOut from './LogOut';

const Home = () => {
  const { user } = useAuth();
  return (
    <div>hello {user?.email} <LogOut/></div>
  )
}

export default Home;
