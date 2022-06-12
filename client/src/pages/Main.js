import { Link } from 'react-router-dom';

const Main = () => {

  return (
  <>
    <h1>{"Spotify Playlist Randomizer!"}</h1>
    <div id="container">
    <Link to="/genre" >
      <button>Genre mode</button>
    </Link>
    <Link to="/chaos">
      <button>Chaos mode</button>
    </Link>
    </div>
  </>
  )};

export default Main;