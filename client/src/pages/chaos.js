import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { generateRandomPlaylist, getRandomGenre, getTopArtists, getTopTracks, chaosLoop, getRecommendations, getCurrentUserProfile, createPlaylist, addSongToPlaylist } from '../spotify';
import { useSpring, Spring, animated } from 'react-spring'
import playlist from './playlist';

const Chaos = () => {
const [seed_genre, setGenre] = useState('???');
const [genreList, setGenreList] = useState(null);
const [seed_artists, setSeedArtists] = useState(null);
const [artist_name, setArtistName] = useState(null);
const [seed_tracks, setSeedTracks] = useState(null);
const [track_name, setTrackName] = useState(null);
const [target_popularity, setTargetPopularity] = useState(50);
const [userID, setUserID] = useState(null);
const [trackURI, setTrackURI] = useState(null);
const [playlistID, setPlaylistID] = useState(null);
const [target_tempo, setTargetTempo] = useState(140);

useEffect(() => {
    const fetchData = async () => {
        const prof = await getCurrentUserProfile();
        setUserID(prof.data.id);

        const data = await getRandomGenre();
        console.log(data);
        setGenreList(data.data.genres);

        const data2 = await getTopArtists();
        setSeedArtists(data2.data.items[0].id);
        setArtistName(data2.data.items[0].name);
        console.log(seed_artists);

        const data3 = await getTopTracks();
        console.log(data3);
        setSeedTracks(data3.data.items[0].id);
        setTrackName(data3.data.items[0].name);
        setTrackURI(data3.data.items[0].uri);
        console.log(seed_tracks);

        //pick random seed
        setGenre(genreList[Math.floor(Math.random()*genreList.length)]);
        console.log(seed_genre);

        setTargetPopularity(Math.floor(Math.random() * (100 - 0) ) + 0);
        setTargetTempo(Math.floor(Math.random() * (220 - 80) ) + 80);
    };
  
    catchErrors(fetchData());
}, []);

const chaosDataLoop = async () => {
    let playlist_info = await createPlaylist(userID);
    setPlaylistID(playlist_info.data.id);
    let playlistIDtemp = playlist_info.data.id;

    console.log("GO GO GO");
    for(let i = 0; i < 100; i++) {
        const chaosData = await chaosLoop(seed_artists, seed_genre, seed_tracks, target_popularity, target_tempo);
        console.log(chaosData);

        setGenre(genreList[Math.floor(Math.random()*genreList.length)]);
        setSeedArtists(chaosData.data.tracks[17].artists[0].id);
        setArtistName(chaosData.data.tracks[17].artists[0].name);
        setSeedTracks(chaosData.data.tracks[17].id);
        setTrackName(chaosData.data.tracks[17].name);
        setTrackURI(chaosData.data.tracks[17].uri);
        let trackURItemp = chaosData.data.tracks[17].uri;
        console.log(i);
        setTargetPopularity(Math.floor(Math.random() * (100 - 0) ) + 0);
        setTargetTempo(Math.floor(Math.random() * (220 - 80) ) + 80);

        if (i % 5 === 0) {
            addSongToPlaylist(playlistIDtemp, trackURItemp);
        }
    };
    console.log("FINISHED");
    //getRecommendations(seed_artists, seed_genre, seed_tracks, target_popularity);
};

    return (
    <Spring from={{ scale: 0 }} to={{ scale: 1 }}>
    {props => (
    <animated.div style={props}>
        <h1>CHAOS!</h1>
        <div id="container">
            <h3>Genre: {seed_genre}</h3>
            <h3>Artist Seed: {artist_name}</h3>
            <h3>Track Seed: {track_name}</h3>
            <h4>Popularity: {target_popularity}</h4>
            <h4>Tempo: {target_tempo}</h4>
                <button class="resultsButton" onClick={chaosDataLoop}>THE CHAOS EMERALDS ARE UNDER MY COMMAND</button>
            <Link to="/playlist">
                <button class="resultsButton">Back</button>
            </Link>
        </div>
    </animated.div>
    )}
    </Spring>
    )
};

export default Chaos;