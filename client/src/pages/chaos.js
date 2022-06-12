import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { generateRandomPlaylist, getRandomGenre, getTopArtists, getTopTracks, chaosLoop, getRecommendations, getCurrentUserProfile, createPlaylist, addSongToPlaylist } from '../spotify';
import { useSpring, Spring, animated } from 'react-spring'
import playlist from './playlist';
import { ProgressBar } from 'react-bootstrap'

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
const [progress, setProgress] = useState(null);
const [target_time_signature, setTargetTimeSignature] = useState(null);
const [market, setMarket] = useState(null);

useEffect(() => {
    const fetchData = async (offset, timeSig) => {
        const prof = await getCurrentUserProfile();
        setUserID(prof.data.id);
        setMarket(prof.data.country);

        const data = await getRandomGenre();
        console.log(data);
        setGenreList(data.data.genres);

        const data2 = await getTopArtists(offset);
        setSeedArtists(data2.data.items[0].id);
        setArtistName(data2.data.items[0].name);
        console.log(seed_artists);

        const data3 = await getTopTracks(offset);
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
        setTargetTimeSignature(timeSig);
    };
  
    let offset = Math.floor(Math.random() * (50 - 0) ) + 0
    let timeSig = timeSigs[Math.floor(Math.random() * timeSigs.length)];
    setTargetPopularity(Math.floor(Math.random() * (100 - 0) ) + 0);
    setTargetTempo(Math.floor(Math.random() * (220 - 80) ) + 80);
    setTargetTimeSignature(timeSig);
    catchErrors(fetchData(offset, timeSig));
}, []);

let timeSigs = [3, 4, 5, 6, 7];

const chaosDataLoop = async () => {
    document.getElementById("resultsButton").style.visibility = "hidden";
    document.getElementById("backButton").style.visibility = "hidden";
    let playlist_info = await createPlaylist(userID);
    setPlaylistID(playlist_info.data.id);
    let playlistIDtemp = playlist_info.data.id;

    const chaosData = await chaosLoop(seed_artists, seed_genre, seed_tracks, target_popularity, target_tempo, target_time_signature, market);
    let seed = Math.floor(Math.random() * (100 - 0) ) + 0
    let genre = genreList[Math.floor(Math.random()*genreList.length)]
    let artists = chaosData.data.tracks[seed].artists[0].id
    let name = chaosData.data.tracks[seed].artists[0].name
    let tracks = chaosData.data.tracks[seed].id
    let trackName = chaosData.data.tracks[seed].name
    let trackURI = chaosData.data.tracks[seed].uri;
    let timeSig = timeSigs[Math.floor(Math.random() * timeSigs.length)];
    let pop = Math.floor(Math.random() * (100 - 0) ) + 0;
    let tempo = Math.floor(Math.random() * (200 - 80) ) + 80;

    console.log("GO GO GO");
    for(let i = 0; i < 100; i++) {
        seed = Math.floor(Math.random() * (100 - 0) ) + 0
        const chaosData = await chaosLoop(artists, genre, tracks, pop, tempo, timeSig, market);
        console.log(chaosData);

        genre = genreList[Math.floor(Math.random()*genreList.length)]
        artists = chaosData.data.tracks[seed].artists[0].id
        name = chaosData.data.tracks[seed].artists[0].name
        tracks = chaosData.data.tracks[seed].id
        trackName = chaosData.data.tracks[seed].name
        trackURI = chaosData.data.tracks[seed].uri;
        timeSig = timeSigs[Math.floor(Math.random() * timeSigs.length)];
        pop = Math.floor(Math.random() * (100 - 0) ) + 0;
        tempo = Math.floor(Math.random() * (200 - 80) ) + 80;

        setGenre(genre);
        setSeedArtists(artists);
        setArtistName(name);
        setSeedTracks(tracks);
        setTrackName(trackName);
        setTrackURI(trackURI);
        setTargetTimeSignature(timeSig);
        setTargetPopularity(pop);
        setTargetTempo(tempo);

        if (i % 5 === 0) {
            addSongToPlaylist(playlistIDtemp, trackURI);
        };
        setProgress(i);
    };
    console.log("FINISHED");
    window.location.href = "/playlist";
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
            <h4>Time Signature: {target_time_signature}/4</h4>
            <h1><ProgressBar animated now={progress} label={`${progress}%`}/></h1>
            <button class="resultsButton" id="resultsButton" onClick={chaosDataLoop}>You mean the Chaos Emeralds? (begin)</button>
            <Link to="/">
                <button class="resultsButton" id="backButton">Back</button>
            </Link>
        </div>
    </animated.div>
    )}
    </Spring>
    )
};

export default Chaos;