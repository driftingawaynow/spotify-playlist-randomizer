import { useState, useEffect } from 'react';
import { catchErrors } from './utils'
import { accessToken, logout, getCurrentUserProfile, generateRandomPlaylist } from './spotify';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import { Login, Main, Genre, Playlist, Chaos } from './pages';
import './App.css';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

function App() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const particlesInit = async (main) => {
    console.log(main);

    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(main);
  };

  const particlesLoaded = async (container) => {
    console.log(container);
  };

  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();
      setProfile(data);
    };

    catchErrors(fetchData());
  }, []);

  return (
    <div className="App">
      <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
          fpsLimit: 120,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 5,
              },
              repulse: {
                distance: 100,
                duration: .4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 100,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 500,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 0, max: 1 },
            },
          },
          detectRetina: true,
        }}
      />
      <header className="App-header">
      {!token ? (
          <Login/>
        ) : (
          <Router>
            <p>Logged in as {profile?.display_name}</p>
            <button className="logout" onClick={logout}>Log Out</button>
            <Routes>
              <Route path="/" element={<Main/>}>
              </Route>
              <Route path="/genre" element={<Genre/>}>
              </Route>
              <Route path="/playlist" element={<Playlist/>}>
              </Route>
              <Route path="/chaos" element={<Chaos/>}>
              </Route>
            </Routes>
          </Router>
        )}
      </header>
    </div>
  );
}

export default App;
