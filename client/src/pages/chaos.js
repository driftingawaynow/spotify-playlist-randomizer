import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { generateRandomPlaylist, getRandomGenre, getTopArtists, getTopTracks, chaosLoop, getRecommendations } from '../spotify';
import { useSpring, Spring, animated } from 'react-spring'

const Chaos = () => {
const [seed_genre, setGenre] = useState(null);
const [seed_artists, setSeedArtists] = useState(null);
const [seed_tracks, setSeedTracks] = useState(null);

useEffect(() => {
    const fetchData = async () => {
        const { data } = await getRandomGenre();
        let genreList = data.genres;

        const { data2 } = await getTopArtists();
        setSeedArtists(data2.data.items);

        const { data3 } = await getTopTracks();
        setSeedTracks(data3.data.items);

        //pick random seed
        let randomGenre = []
        for(let i = 0; i < 5; i++) {
            randomGenre.push(genreList[Math.floor(Math.random()*genreList.length)]);
        }
        setGenre(randomGenre);

        for(let i = 0; i < 1000; i++) {
            const { chaosData } = await chaosLoop(seed_artists, seed_genre, seed_tracks);

            let randomGenre = []
            for(let i = 0; i < 5; i++) {
                randomGenre.push(genreList[Math.floor(Math.random()*genreList.length)]);
            }
            setGenre(randomGenre);
            setSeedArtists(chaosData.tracks.artists.id);
            setSeedTracks(chaosData.tracks.id);
        };
    };
  
    catchErrors(fetchData());
}, []);


    return (
    <Spring from={{ scale: 0 }} to={{ scale: 1 }}>
    {props => (
    <animated.div style={props}>
        <h1>CHAOS!</h1>
        <div id="container">
            <Link to="/playlist">
                <button class="resultsButton" onClick={() => getRecommendations(seed_genre, seed_artists, seed_tracks)}>Accept</button>
            </Link>
        </div>
    </animated.div>
    )}
    </Spring>
    )
};

export default Chaos;