import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { RootState, AppDispatch } from '../store';

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      <h2>Home Page</h2>
      <p>Welcome, {user?.firstName} {user?.lastName}!</p>
      <p>Username: {user?.username}</p>
      <p>This is a protected page that is only accessible after login.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;