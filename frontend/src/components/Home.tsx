import FriendSection from './friends/FriendSection';
import PostSection from './PostSection';
import Chat from './Chat';
import Navbar from './Navbar';

const Home = () => {
  return (
    <>
      <Navbar />
      <div className='grid grid-cols-4 gap-4'>
        <FriendSection />
        <div className='col-span-2'>
          <PostSection />
        </div>
        <Chat />
      </div>
    </>
  );
};

export default Home;