import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { accessToken, logout, getCurrentUserProfile, generateRandomPlaylist } from '../spotify';
import { Link } from 'react-router-dom';
import { useSpring, animated } from 'react-spring'
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();
      console.log(data);
      setProfile(data);
    };

    catchErrors(fetchData());
  }, []);

  const props = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } })

  return (
    <>
      {profile && (
        <>
          <h1>{"Spotify Playlist Randomizer!"}</h1>
          <div id="container">
          <Link to="/results" >
            <button>Genre mode</button>
          </Link>
          <Link to="/chaos">
            <button>Chaos mode</button>
          </Link>
          </div>
        </>
      )}
    </>
  )
};

export default Profile;